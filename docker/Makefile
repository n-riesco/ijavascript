LABELS = \
	node-0.10 \
	node-0.12 \
	node-4 \
	node-6 \
	node-8 \
	node-10 \
	node-12 \
	node-14 \
	node-16 \
	latest

BUILDS = $(LABELS:%=build-%)
REBUILDS = $(LABELS:%=rebuild-%)
SHELLS = $(LABELS:%=shell-%)
TESTS = $(LABELS:%=test-%)
.PHONY = build $(BUILDS) rebuild $(REBUILDS) test $(TESTS) $(SHELLS)

DIR_CONTEXT = ..
DIR_DOCKERFILES = .

build: $(BUILDS)
	echo Building all...

$(BUILDS):
	docker build -t $(@:build-%=ijs:%) -f "${DIR_DOCKERFILES}/$(@:build-%=Dockerfile.%)" "${DIR_CONTEXT}"

rebuild: $(REBUILDS)
	echo Rebuilding all...

$(REBUILDS):
	docker build --no-cache -t $(@:rebuild-%=ijs:%) -f "${DIR_DOCKERFILES}/$(@:rebuild-%=Dockerfile.%)" "${DIR_CONTEXT}"

test: $(TESTS)
	echo Testing all...

$(TESTS):
	docker run --rm -it $(@:test-%=ijs:%)

$(SHELLS):
	docker run --rm -it $(@:shell-%=ijs:%) /bin/bash