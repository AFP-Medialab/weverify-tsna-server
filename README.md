start project:
```
npm install
npm run dev
````

Build Docker image:

```
docker build --tag tsna-server:<version> .
```

#Env variables
Create .env file at root level

```
REACT_APP_GEXF_GENERATOR_URL=https://weverify-gexf.gate.ac.uk/generate/
REACT_APP_MY_WEB_HOOK_URL=https://hooks.slack.com/services/XXXXXXXXXXXXX
#REACT_APP_BASE_DOC=/tsna

#REACT_APP_I18N_CONTENT=http://localhost:8001
REACT_APP_I18N_CONTENT=https://raw.githubusercontent.com/AFP-Medialab/InVID-Translations/react


REACT_APP_ELK_URL=http://localhost:9200/tsnatweets/_search
REACT_APP_ES_USER_URL=http://localhost:9200/tsnausers/_search
REACT_APP_AUTH_BASE_URL=http://localhost:8080/twint-wrapper

TSV_SRV_LOCATION_PATH=../InVID-Translations
```

## I18N support
* Clone project https://github.com/AFP-Medialab/InVID-Translations
* Use react branch
* Set variable TSV_SRV_LOCATION_PATH to InVID-Translations directory
* run tsv-server container:
```
docker-compose -f docker-compose-tsv-server.yml up -d
```