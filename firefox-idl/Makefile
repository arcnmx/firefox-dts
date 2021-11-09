install: $(DESTDIR)/xpidl $(DESTDIR)/xpcom/services.json $(DESTDIR)/xpcom/manifest-lists.json $(DESTDIR)/webidl

include config/makefiles/xpidl/.deps/*.pp

$(DESTDIR)/xpidl/%.xpt: ./%.xpt
	install -Dm0644 -t $(DESTDIR)/xpidl config/makefiles/xpidl/$*.xpt

./%.xpt:
	echo $(filter %.idl,$^) > $@

$(DESTDIR)/xpidl/%.deps: ./%.xpt
	for f in $$(cat $<); do install -Dm0644 $$f $(DESTDIR)/xpidl/$${f#$(NIX_BUILD_TOP)/$(sourceRoot)}; done
	sed 's%$(NIX_BUILD_TOP)/$(sourceRoot)/%%g' $< > $@

XPT_SOURCES := $(wildcard config/makefiles/xpidl/*.xpt)
XPT_OUTPUTS := $(patsubst config/makefiles/xpidl/%.xpt,$(DESTDIR)/xpidl/%.xpt,$(XPT_SOURCES))
XPT_DEPS := $(patsubst config/makefiles/xpidl/%.xpt,$(DESTDIR)/xpidl/%.deps,$(XPT_SOURCES))
$(DESTDIR)/xpidl: $(XPT_OUTPUTS) $(XPT_DEPS)
	echo $^

$(DESTDIR)/xpcom/services.json: xpcom/components/services.json
	install -Dm0644 -t $(DESTDIR)/xpcom xpcom/components/{Components.h,StaticComponentData.h,StaticComponents.cpp,Unified_cpp_xpcom_components0.cpp}
	install -Dm0644 $< $@

$(DESTDIR)/xpcom/manifest-lists.json: xpcom/components/manifest-lists.json
	for f in $$(jq -re '.manifests[]' $<); do install -Dm0644 $$f $(DESTDIR)/xpcom/$${f#$(NIX_BUILD_TOP)/$(sourceRoot)}; done
	sed 's%$(NIX_BUILD_TOP)/$(sourceRoot)/%%g' $< > $@

$(DESTDIR)/webidl:
	for f in $$(find $(NIX_BUILD_TOP)/$(sourceRoot) -name '*.webidl'); do install -Dm0644 $$f $@/$${f#$(NIX_BUILD_TOP)/$(sourceRoot)}; done
	mv $@/obj-*/dom/bindings/* $@/dom/bindings/
	rmdir $@/obj-*/{dom/bindings,dom,}
