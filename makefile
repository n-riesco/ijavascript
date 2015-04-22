# Makefile
#

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo " jsdoc  		       to create HTML files for doc"
	@echo " publish-doc  	            publish doc to gh-pages"

jsdoc:
	ipython nbconvert 'doc/tutorials/*.ipynb' --FilesWriter.build_directory='doc/tutorials';
	npm run doc;
	cp -r doc/images/ doc/output/
	@echo
	@echo "Build finished. The Documentation is in doc/output."
	@echo "Cleaning up"

publish-doc: jsdoc
	ghp-import doc/output
	git push origin gh-pages;
	@echo
	@echo "Build finished. The Documentation is in doc/output."
	@echo "Cleaning up"
