
build: clean
	jekyll build

publish: build
	# Update container on k8s server
	docker build -t pollinimini-net:local .
	# Sync the cluster with the new container
	kubectl apply -f k8s.yaml

serve: clean
	jekyll serve --watch

clean:
	rm -rf _site
