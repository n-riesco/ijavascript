# Makefile
#

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo " jsdoc									 to create HTML files for doc"

jsdoc:
	ipython nbconvert 'doc/ipynb/*.ipynb' --FilesWriter.build_directory='doc/tutorials';
	npm run doc;
	cp -r doc/Images/ doc/output/
	@echo
	@echo "Build finished. The Documentation is in doc/output."
	@echo "Cleaning up"
	rm doc/tutorials/*.html;
