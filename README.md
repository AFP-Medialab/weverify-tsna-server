start project:

```
npm install
npm run dev
```

Build Docker image:

```
docker build --tag tsna-server:<version> .
```

#Env variables
Create .env file at root level

```
REACT_APP_GOOGLE_ANALYTICS_KEY=YOUR_GA_KEY
REACT_APP_GEXF_GENERATOR_URL=https://weverify-gexf.gate.ac.uk/generate/
REACT_APP_MY_WEB_HOOK_URL=https://hooks.slack.com/services/XXXXXXXXXXXXX
#REACT_APP_BASE_DOC=/tsna

#REACT_APP_I18N_CONTENT=http://localhost:8001
REACT_APP_I18N_CONTENT=https://raw.githubusercontent.com/AFP-Medialab/InVID-Translations/react


REACT_APP_ELK_URL=http://localhost:9200/tsnatweets/_search
REACT_APP_ES_USER_URL=http://localhost:9200/tsnausers/_search
# If your Elasticsearch requires authentication, set credentials and uncomment
# the relevant lines in docker-compose.yml
# REACT_APP_ES_USERNAME=user
# REACT_APP_ES_PASSWORD=password
REACT_APP_AUTH_BASE_URL=http://localhost:8080/weverify-wrapper

TSV_SRV_LOCATION_PATH=../InVID-Translations
```

## Docker env support for client page

Some env which are used in client page are also set in .env.production file with a temporary custom key.
at docker image build, these values are replace by entrypoint.sh script with runtime environement.

```
REACT_APP_GOOGLE_ANALYTICS_KEY=NEXT_PUBLIC_GOOGLE_ANALYTICS_KEY
REACT_APP_GEXF_GENERATOR_URL=NEXT_PUBLIC_GEXF_GENERATOR_URL
```

## I18N support

- Clone project https://github.com/AFP-Medialab/InVID-Translations
- Use react branch
- Set variable TSV_SRV_LOCATION_PATH to InVID-Translations directory
- run tsv-server container:

```
docker-compose -f docker-compose-tsv-server.yml up -d
```
