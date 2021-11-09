FIREFOX_IDL_ROOT ?= $(shell nix-build --no-out-link . -A firefox-idl)
IDL_ROOT ?= $(FIREFOX_IDL_ROOT)/xpidl
XPCOM_ROOT ?= $(FIREFOX_IDL_ROOT)/xpcom
BUILD ?= build
DTS_PY ?= $(shell nix-build --no-out-link . -A xpidl-dts)
DESTDIR ?= types

IDL_DIRS := $(shell ./iterate_idl.sh $(IDL_ROOT))
IDL_DIRNAMES := $(subst /,_,$(IDL_DIRS))
DTS_FILES := $(patsubst %,$(BUILD)/%.d.ts,$(IDL_DIRNAMES))

all: $(BUILD)/services.d.ts $(BUILD)/components.d.ts $(DTS_FILES)

clean:
	rm -f $(BUILD)/services.d.ts $(BUILD)/components.d.ts
	rmdir $(BUILD)

install: xpidl.d.ts $(BUILD)/services.d.ts $(BUILD)/components.d.ts $(DTS_FILES)
	install -Dm0644 -t $(DESTDIR) $^

$(BUILD):
	mkdir -p $(BUILD)

$(DTS_FILES):
	$(DTS_PY) idl $@ $(IDL_ROOT) $(patsubst $(BUILD)/%.d.ts,$(IDL_ROOT)/%,$(subst _,/,$@))

$(BUILD)/services.d.ts: $(BUILD)
	$(DTS_PY) services $@ $(XPCOM_ROOT)

$(BUILD)/components.d.ts: $(BUILD)
	$(DTS_PY) components $@ $(XPCOM_ROOT)

.PHONY: all clean install
.DELETE_ON_ERROR:
