#/bin/bash

# removes all turtle files from the data folder 
# and then copies the test files there

find data/ -type f -not -name '.gitignore' -delete
cp test/data/ttl/hashURIConceptScheme.ttl \
  test/data/ttl/interactivityType.ttl \
  test/data/ttl/oneConceptSchemeTwoFiles_1.ttl \
   test/data/ttl/oneConceptSchemeTwoFiles_2.ttl \
 test/data/ttl/slashURIConceptScheme.ttl \
 test/data/ttl/slashURIConceptSchemeDCproperties.ttl \
 test/data/ttl/systematik.ttl \
 test/data/ttl/twoConceptSchemesOneFile.ttl \
   data/

cp cypress/config.e2e.yaml ./config.yaml
