#/bin/bash

# removes all turtle files from the data folder 
# and then copies the test files there

find data/ -type f -not -name '.gitignore' -delete
cp test/data/slashURIConceptScheme.ttl test/data/hashURIConceptScheme.ttl test/data/interactivityType.ttl data/
