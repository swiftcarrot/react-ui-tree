all:
	babel lib --out-dir dist
	lessc lib/react-ui-tree.less > dist/react-ui-tree.css
clean:
	rm dist/*
