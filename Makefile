FIREFOX_IDL_ROOT ?= $(shell nix-build --no-out-link . -A firefox-idl)
IDL_ROOT ?= $(FIREFOX_IDL_ROOT)/xpidl
XPCOM_ROOT ?= $(FIREFOX_IDL_ROOT)/xpcom
BUILD ?= build
DTS_PY ?= $(shell nix-build --no-out-link . -A xpidl-dts)
DESTDIR ?= types

SOURCES := $(wildcard src/*.ts)
IDL_DIRS := $(shell ./iterate_idl.sh $(IDL_ROOT))
IDL_DIRNAMES := $(subst /,_,$(IDL_DIRS))
DTS_FILES := $(patsubst %,$(BUILD)/types/%.d.ts,$(IDL_DIRNAMES))

all: $(BUILD)/types/services.d.ts $(BUILD)/types/components.d.ts $(DTS_FILES)

clean:
	rm -f $(BUILD)/types/services.d.ts $(BUILD)/types/components.d.ts $(DTS_FILES)

install: $(SOURCES) $(BUILD)/types/services.d.ts $(BUILD)/types/components.d.ts $(DTS_FILES)
	install -Dm0644 -t $(DESTDIR) $^

check: $(DTS_FILES)
	tsc -p src --noEmit

$(BUILD):
	mkdir -p $(BUILD)/types

$(DTS_FILES): $(BUILD)
	$(DTS_PY) idl $@ $(IDL_ROOT) $(wildcard $(patsubst $(BUILD)/types/%.d.ts,$(IDL_ROOT)/%,$(subst _,/,$@))/*.idl)

$(BUILD)/types/services.d.ts: $(BUILD)
	$(DTS_PY) services $@ $(XPCOM_ROOT)

$(BUILD)/types/components.d.ts: $(BUILD)
	$(DTS_PY) components $@ $(XPCOM_ROOT)

.PHONY: all clean install check
.DELETE_ON_ERROR:
