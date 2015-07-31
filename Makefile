all:
	babel lib --out-dir dist
	lessc lib/react-ui-tree.less > dist/react-ui-tree.css
	webpack -p
clean:
	rm dist/*
	rm example/bundle*
