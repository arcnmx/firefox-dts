#!/usr/bin/env python

import os
import sys
import re
import json
import pathlib
import enum
from xpidl import xpidl, jsonxpt

numeric_types = [
    "uint8_t", "uint16_t", "uint32_t", "uint64_t",
    "int8_t", "int16_t", "int32_t", "int64_t",
    "float", "double",
    "char", "char16_t",
]
builtin_types = {
    "wstring": "any", # TODO?
    "string": "string",
    "boolean": "boolean",
    "void": "void",
}
special_types = {
    #"nsid": "nsid",
    "utf8string": "Xp.nsCString",
    "cstring": "Xp.nsCString",
    "astring": "Xp.nsString",
    "jsval": "unknown",
    "promise": "Promise<unknown>",
    "Promise": "Promise<unknown>",
}
reserved_keywords = [
    "debugger",
    "function",
    "import",
]
blacklisted_types = [
    "DOMTimeStamp",
    "DOMHighResTimeStamp",
]
base_exceptions = [
    "nsIXPCComponents_Classes",
    "nsIXPCComponents_Interfaces",
]

def sanitize_ident(ident):
    if ident in reserved_keywords:
        return f"{ident}_"
    else:
        return ident

def builtin_name(nativename, name=None, fail=False):
    if name is None:
        name = nativename
    if nativename in numeric_types:
        return "number"
    elif builtin_types.get(name) is not None:
        return builtin_types[name]
    elif fail:
        raise Exception(f"unknown builtin {name}")
    else:
        return None

def format_typename(ty, name=None):
    if name is None:
        name = ty.name
    if isinstance(ty, xpidl.TypeId):
        if ty.params is None:
            return builtin_name(ty.name, True)
        else:
            raise Exception(f"TODO TypeId with params: {ty}")
    elif isinstance(ty, xpidl.Typedef):
        return ty.name
    elif isinstance(ty, xpidl.Builtin):
        b = builtin_name(ty.nativename, ty.name)
        return builtin_name(ty.nativename, ty.name, True)
    elif isinstance(ty, xpidl.LegacyArray):
        return f"Xp.LegacyArray<{format_typename(ty.type)}>"
    elif isinstance(ty, xpidl.Array):
        # TODO: elem_ty = ty.type.resolve(idl)
        return f"Array<{format_typename(ty.type)}>"
    elif isinstance(ty, xpidl.Native):
        if ty.specialtype in special_types:
            return special_types[ty.specialtype]
        elif ty.specialtype == "nsid":
            return ty.nativename
        else:
            nativename = ty.nativename
            if isinstance(nativename, tuple):
                nativename = nativename[2]
            return f"Xp.Native<'{nativename}'>"
    elif isinstance(ty, xpidl.CEnum):
        return f"Xp.Enums.{ty.iface.name}.{ty.basename}"
    elif ty.kind == "interface" or ty.kind == "forward":
        # forward declarations are fine to reference as-is
        return f"Ci.{ty.name}"
    elif ty.kind == "webidl":
        return ty.name
    else:
        print(f"unknown type.kind {ty.kind} for {name}", file=sys.stderr)
        return ty.name

def process_enum_members(enum, interface, file):
    for variant in enum.variants:
        print(f"\t\treadonly {variant.name}: Xp.Enums.{interface.name}.{enum.basename}.{variant.name};", file=file)

def process_enum(enum, interface, file):
    print(f"\tconst enum {enum.basename} {{", file=file)
    for variant in enum.variants:
        print(f"\t\t{variant.name} = {variant.value},", file=file)
    print(f"\t}}", file=file)

def process_const(attr, file):
    print(f"\t\treadonly {attr.name}: {format_typename(attr.realtype, attr.type)} & {attr.value};", file=file)

def process_attribute(attr, file):
    if attr.noscript or attr.notxpcom:
        return
    readonly = "readonly " if attr.readonly else ""
    print(f"\t\t{readonly}{attr.name}: {format_typename(attr.realtype, attr.type)};", file=file)

def process_method(method, file):
    if method.noscript or method.notxpcom:
        return
    ret = None
    params = []
    optional_allowed = False
    for param in method.params:
        if param.optional:
            optional_allowed = True
        elif optional_allowed:
            # in the case that optionals are not the trailing params, they cannot be made optional
            optional_allowed = False
            break
    for param in method.params:
        ident = sanitize_ident(param.name)
        ty = format_typename(param.realtype, param.type)
        if param.array:
            ty = f"Array<{ty}>"
        if param.optional:
            if optional_allowed:
                ident = f"{ident}?"
            else:
                ty = f"{ty} | undefined"
        elif param.default_value is not None:
            raise Exception(f"param {param.name} of method {method.name} has default but is not optional")
        if param.retval:
            if ret is not None:
                raise Exception(f"method {method.name} has default but is not optional")
            ret = ty
            continue
        params.append(f"{ident}: {ty}")
    if ret is None:
        ret = format_typename(method.realtype, method.type)
    print(f"\t\t{method.name}({', '.join(params)}): {ret};", file=file)

def process_interface(interface, file):
    if interface.namemap is None:
        raise Exception("Interface was not resolved")
    base = f" extends {interface.base}" if interface.base is not None else ""
    if interface.name in base_exceptions:
        base = ""
    print(f"declare namespace Ci {{", file=file)
    print(f"\tinterface {interface.name}{base} {{", file=file)
    enums = []
    consts = []
    for member in interface.members:
        if interface.attributes.noscript:
            break
        if isinstance(member, xpidl.ConstMember):
            process_const(member, file)
            consts.append(member)
        elif isinstance(member, xpidl.Attribute):
            process_attribute(member, file)
        elif isinstance(member, xpidl.Method):
            process_method(member, file)
        elif isinstance(member, xpidl.CEnum):
            enums.append(member)
            process_enum_members(member, interface, file)
        elif isinstance(member, xpidl.CDATA):
            pass
        else:
            raise Exception(f"Unexpected interface member: {member}")
    print(f"\t}}", file=file)
    print(f"}}", file=file)
    print(f"declare namespace Ci.{interface.name} {{", file=file)
    print(f"\tinterface Interface extends nsIID<{interface.name}> {{", file=file)
    print(f"\t\treadonly name: \"{interface.name}\";", file=file)
    print(f"\t\treadonly number: \"{interface.attributes.uuid}\";", file=file)
    for member in enums:
        process_enum_members(member, interface, file)
    for member in consts:
        process_const(member, file)
    print(f"\t}}", file=file)
    print(f"}}", file=file)
    if len(enums) > 0:
        # https://github.com/Microsoft/TypeScript/issues/17372
        print(f"declare namespace Xp.Enums.{interface.name} {{", file=file)
        for member in enums:
            process_enum(member, interface, file)
        print(f"}}", file=file)

native_tag = "Xp.NativeSymbol"
def process_native(native, file):
    if native.name in special_types:
        return
    elif native.specialtype == "nsid":
        print(f"declare type {native.name} = nsid;", file=file)
    else:
        nativename = native.nativename
        if isinstance(nativename, tuple):
            nativename = nativename[2]
        print(f"declare type {native.name} = {{ readonly [{native_tag}]: '{nativename}' }};", file=file)

def process_typedef(typedef, file):
    if typedef.name in blacklisted_types:
        return
    print(f"declare type {typedef.name} = {format_typename(typedef.realtype, typedef.type)};", file=file)

def process_item(item, file):
    if item.kind == "interface":
        process_interface(item, file)
    elif item.kind == "native":
        #process_native(item, file)
        pass
    elif item.kind == "typedef":
        process_typedef(item, file)
    elif item.kind == "include" or item.kind == "forward" or item.kind == "cdata":
        pass
    elif item.kind == "webidl":
        print(f"interface {item.name} {{ }}", file=file)
    else:
        print(f"ignoring unknown {item.kind}", file=sys.stderr)

class Xpidl(object):
    def __init__(self, webidlconfig={}):
        self.xpidl_files = []
        self.parser = xpidl.IDLParser()
        self.idls = []
        self.incdirs = []
        self.includeCache = {}
        self.webidlconfig = webidlconfig

    def add_path(self, path):
        if os.path.isdir(path):
            for path in pathlib.Path(path).rglob('*.idl'):
                self.xpidl_files.append(path)
        else:
            self.xpidl_files.append(path)

    def parse_all(self):
        for path in self.xpidl_files:
            print(f"Parsing {path}...", file=sys.stderr)
            idl = open(path, encoding="utf-8").read()
            idl = self.parser.parse(idl, filename=path)
            idl.pathname = path
            self.idls.append(idl)

    def resolve_incdirs(self, root):
        for root, dirnames, filenames in os.walk(root):
            for dirname in dirnames:
                self.incdirs.append(os.path.join(root, dirname))

    def resolve(self):
        for idl in self.idls:
            print(f"Resolving {idl.pathname}...", file=sys.stderr)
            idl.resolve(self.incdirs, self.parser, self.webidlconfig, self.includeCache)

    def generate(self, file):
        out = []
        for idl in self.idls:
            #print(json.dumps(jsonxpt.build_typelib(idl)))
            for item in idl.productions:
                process_item(item, file)
        print(f"declare namespace Ci {{", file=file)
        print(f"\tinterface nsIXPCComponents_Interfaces {{", file=file)
        for idl in self.idls:
            for item in idl.productions:
                if item.kind == "interface" and not item.name in base_exceptions:
                    print(f"\t\treadonly {item.name}: Ci.{item.name}.Interface;", file=file)
        print(f"\t}}", file=file)
        print(f"}}", file=file)

#class ManifestParser(object):
#    def __init__(self, manifests_list):
#        self.manifest_names

class Class(object):
    def __init__(self, data):
        self.cid = data["cid"]
        self.contract_ids = data.get("contract_ids", [])
        self.name = data.get("name")
        self.js_name = data.get("js_name")
        self.type = data.get("type")
        self.interfaces = data.get("interfaces", [])
        self.legacy_constructor = data.get("legacy_constructor")
        self.constructor = data.get("constructor")
        self.headers = data.get("headers", [])
        self.jsm = data.get("jsm")
        #data.constructor

    # example in js: `Cc[{self.cc()}]`
    def cc(self):
        return self.contract_ids[0]

    def type_name(self):
        if self.type is not None:
            if "::" in self.type:
                return self.type.split("::")[-1]
            else:
                return self.type
        else:
            return None

    def extends(self):
        out = ["Xp.Component", "Ci.nsISupports"]
        out.extend([f"Ci.{i}" for i in self.interfaces])
        return out

    def ts_type(self):
        if self.type is not None:
            return f"Cc.{self.type_name()}"
        else:
            return ' & '.join(self.extends())

class BuildConfig(object):
    substs = { }

class ProcessSelector(enum.Enum):
    MAIN_PROCESS_ONLY = enum.auto
    ALLOW_IN_SOCKET_PROCESS = enum.auto
    CONTENT_PROCESS_ONLY = enum.auto
    ALLOW_IN_GPU_RDD_VR_AND_SOCKET_PROCESS = enum.auto
    ALLOW_IN_GPU_AND_MAIN_PROCESS = enum.auto
    ALLOW_IN_GPU_RDD_AND_SOCKET_PROCESS = enum.auto
    ANY_PROCESS = enum.auto
class BackgroundTasksSelector(enum.Enum):
    ALL_TASKS = enum.auto

buildconfig = BuildConfig()
buildconfig.substs = {
    # TODO: make these a special type that is considered equal to all strings!
    # this will enable all comparisons together
    "MOZ_WIDGET_TOOLKIT": "gtk",
    "OS_ARCH": "Linux",
    "MOZ_DEVTOOLS": "all",
    "MOZ_ENABLE_DBUS": "1",
    "OS_TARGET": "idk", # "Android" is a valid value
}

def parse_manifest_lists(xpcom_dir):
    jsonfile = open(os.path.join(xpcom_dir, "manifest-lists.json"), "r")
    out = {}
    for conf_path in json.load(jsonfile)["manifests"]:
        print(f"parsing manifest {conf_path} ...", file=sys.stderr)
        conf = open(os.path.join(xpcom_dir, conf_path), "r")
        loc = {
            "buildconfig": buildconfig,
            "defined": lambda key: key in buildconfig.substs and buildconfig.substs[key] != "0",
        }
        exec(conf.read(), globals(), loc) # sets `Classes` to a list of class data
        out[conf_path] = [Class(c) for c in loc["Classes"]]
    return out

def parse_services(xpcom_dir):
    jsonfile = open(os.path.join(xpcom_dir, "services.json"), "r")
    out = {}
    for key, value in json.load(jsonfile).items():
        if out.get(value) is None:
            out[value] = []
        out[value].append(f"Ci.{key}")
    return out

def main():
    mode = sys.argv[1]
    out = sys.argv[2]
    if mode == "idl":
        root = sys.argv[3]
        parser = Xpidl()
        parser.resolve_incdirs(root)
        for dirname in sys.argv[4:]:
            print(f"Parsing IDLs in {dirname}...", file=sys.stderr)
            parser.add_path(dirname)
        parser.parse_all()
        parser.resolve()
        ofile = open(out, "w")
        parser.generate(ofile)
    elif mode == "components":
        xpcom_dir = sys.argv[3]
        manifests = parse_manifest_lists(xpcom_dir)
        ofile = open(out, "w")
        print(f"declare namespace Ci {{", file=ofile)
        print(f"\tinterface nsIXPCComponents_Classes {{", file=ofile)
        for path, cls in manifests.items():
            for cl in cls:
                for cid in cl.contract_ids:
                    print(f"\t\treadonly ['{cid}']: Xp.Contract<{cl.ts_type()}>;", file=ofile)
        print(f"\t}}", file=ofile)
        print(f"}}", file=ofile)
        print(f"declare namespace Cc {{", file=ofile)
        for path, cls in manifests.items():
            for cl in cls:
                if cl.type is not None:
                    print(f"\tinterface {cl.type_name()} extends {', '.join(cl.extends())} {{ }}", file=ofile)
        print(f"}}", file=ofile)

        print(f"declare interface ChromeUtils {{", file=ofile)
        for path, cls in manifests.items():
            for cl in cls:
                if cl.jsm is not None:
                    print(f"\timport(url: '{cl.jsm}'): {cl.ts_type()};", file=ofile)
        print(f"}}", file=ofile)

        print(f"declare namespace nsIXPCComponents_Utils {{", file=ofile)
        for path, cls in manifests.items():
            for cl in cls:
                if cl.jsm is not None:
                    print(f"\tfunction {sanitize_ident('import')}(url: '{cl.jsm}'): {cl.ts_type()};", file=ofile)
        print(f"\texport {{ {sanitize_ident('import')} as import }}", file=ofile)
        print(f"}}", file=ofile)
    elif mode == "services":
        xpcom_dir = sys.argv[3]
        services = parse_services(xpcom_dir)
        ofile = open(out, "w")
        print(f"declare namespace Xp {{", file=ofile)
        print(f"\tinterface Services {{", file=ofile)
        for ident, interfaces in services.items():
            print(f"\t\treadonly {ident}: {' & '.join(interfaces)}", file=ofile)
        print(f"\t}}", file=ofile)
        print(f"}}", file=ofile)

if __name__ == "__main__":
    main()
