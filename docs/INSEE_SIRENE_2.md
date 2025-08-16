Contenu du répertoire Sirene à la date d'aujourd'hui

Institué par les articles R. 123-220 à R. 123-234 du code de commerce, le Répertoire National d’identification des entreprises et des établissements concerne les unités implantées en métropole, dans les DOM et dans les collectivités d'Outre-Mer de Saint Pierre et Miquelon, Saint Barthélémy et Saint Martin. La gestion de ce répertoire est confiée à l’INSEE. Elle est effectuée à travers le système Sirene (Système Informatique pour le Répertoire des ENtreprises et des Etablissements). L’INSEE est chargé d’identifier :
les entrepreneurs individuels exerçant de manière indépendante une profession non salariée (exemple : un commerçant, un médecin) ;
les personnes morales de droit privé ou de droit public soumises au droit commercial ;
les institutions et services de l’État et les collectivités territoriales, ainsi que tous leurs établissements ;
les associations dans certains cas.
Sont donc inscrites au répertoire tous les entrepreneurs individuels ou les personnes morales :
immatriculées au Registre du Commerce et des Sociétés ;
immatriculées au Répertoire des Métiers ;
employant du personnel salarié (à l’exception des particuliers employeurs) ;
soumises à des obligations fiscales ;
bénéficiaires de transferts financiers publics.
Toutes les mises à jour d’entreprises et d’établissements (créations, modifications, cessations) enregistrés dans Sirene proviennent des informations déclaratives des entreprises auprès du Guichet Unique et de certains Centres de Formalités des Entreprises (CFE).
Historique du répertoire Sirene

Le décret n°73-314 du 14 mars 1973 a confié à l’Insee la tenue du répertoire Sirene.
Le décret n°83-121 du 17 février 1983 a étendu les données du répertoire Sirene :
aux personnes morales de droit public soumises au droit commercial (entreprises publiques) ;
aux personnes morales (ou organismes assimilés comme telles) soumises au droit administratif (comme les institutions et services de l’État, les collectivités territoriales, etc.).
Le répertoire Sirene contient toutes les entreprises actives à la création du répertoire et celles créées depuis. Pour les personnes morales de droit public et les administrations, le répertoire est exhaustif depuis 1983. L'intégration complète du secteur privé agricole date de 1993.
Définition de l'unité légale

L'unité légale est une entité juridique de droit public ou privé. Cette entité juridique peut être :
une personne morale, dont l'existence est reconnue par la loi indépendamment des personnes ou des institutions qui la possèdent ou qui en sont membres ;
une personne physique, qui, en tant qu'indépendant, peut exercer une activité économique.
Elle est obligatoirement déclarée aux administrations compétentes (Greffes des tribunaux, Sécurité sociale, DGI...) pour exister. L'existence d'une telle unité dépend du choix des propriétaires ou de ses créateurs (pour des raisons organisationnelles, juridiques ou fiscales). L'unité légale est l'unité principale enregistrée dans Sirene.

Remarque : cette définition de l'unité légale ne doit pas être confondue avec celle de l'entreprise au sens de la loi de modernisation de l’économie (LME), considérée comme unité statistique.
Diffusion du répertoire Sirene en open data

La loi n° 2016-1321 du 7 octobre 2016 pour une république numérique prévoit la mise à disposition gratuite (open data) du répertoire Sirene. Pour s'y conformer, l'Insee a mis en place 3 canaux de diffusion :
Le site Sirene.fr, qui permet d'accéder simplement au contenu, sans ouverture de compte, pour rechercher une entreprise ou constituer des listes d'établissements. Seules les valeurs courantes des variables sont disponibles ;
Les APIs Sirene, qui permettent après création d'un compte, une exploration complète des données, manuellement ou automatiquement. Les valeurs courantes et, le cas échéant, les valeurs historiques des variables sont disponibles ;
Les fichiers stock, mis à jour chaque début de mois, qui permettent le téléchargement d’une copie complète de la base Sirene sous forme de fichiers disponibles sur data.gouv.fr :
le fichier stock des entreprises (entreprises actives et cessées dans leur état courant au répertoire) ;
le fichier stock des valeurs historisées des entreprises ;
le fichier stock des établissements (établissements actifs et fermés dans leur état courant au répertoire) ;
le fichier stock des valeurs historisées des établissements ;
le fichier stock des liens de succession des établissements.
Les données historisées

Sirene conserve tout l‘historique des variables dans les cas suivants :
les informations figurent dans le code de commerce comme, par exemple, la dénomination ;
les informations sont utiles au sens de l’utilisation statistique comme, par exemple, le caractère employeur ou non de l’unité légale.
Quand une variable est historisée au niveau de l’unité légale, si son pendant existe au niveau de l’établissement, il est également historisé. C’est ainsi qu’on dispose de :
l’historique du statut employeur d’une unité légale donnée ;
l’historique du statut employeur de chacun des établissements qui dépendent de cette unité légale.
L'historisation des variables du répertoire Sirene a été mise en oeuvre à partir de 2005.
Variables historisées au niveau de l'unité légale

Les variables historisées au niveau de l'unité légale sont les suivantes :
La dénomination pour les personnes morales ;
Le nom de naissance pour les personnes physiques ;
Le nom d’usage pour les personnes physiques ;
La dénomination usuelle ;
La catégorie juridique ;
L'état ;
Le Nic du siège ;
L'activité principale ;
Le caractère employeur ;
L’appartenance à l’économie sociale et solidaire (ESS) ;
L’appartenance au champ des sociétés à mission.
Variables historisées au niveau de l'établissement

Les variables historisées au niveau de l'établissement sont les suivantes :
L'enseigne ;
La dénomination usuelle ;
L'activité principale de l'établissement ;
La nomenclature de l'activité principale de l'établissement ;
L'état ;
Le caractère employeur de l'établissement.
Définition de l'historique

L'historique se présente comme une liste de périodes, distinctes les unes des autres. Une période est définie par le Siren ou le Siret (Siren+Nic), la date de début et la date de fin. La date de fin d’une période correspond à la veille du début de la période suivante. Au cours d’une période, toutes les valeurs des variables historisées sont constantes. Dans les fichiers stock, pour chaque Siren ou Siret, il y a autant de lignes que de périodes. Quel que soit le nombre de périodes, les fichiers ont toujours la même structure. Pour chaque variable historisée, une indicatrice de changement donne l’information sur une modification par rapport à la période précédente (si l’indicatrice est à true, il y a eu changement par rapport à la période précédente).
La date 1900-01-01 correspond dans la très grande majorité des cas à une date manquante, comme la valeur null. Les dates de début et de fin sont issues des historiques des variables concernées et par conséquent le résultat de gestions successives depuis la création du répertoire Sirene. La cohérence entre les dates des différentes variables n'est pas obligatoirement assurée. En conséquence, les premières périodes peuvent avoir des valeurs de variables historisées à null juste par construction. Les dates de ces périodes sont des dates d’effet (par opposition aux dates de traitement).
Les unités disponibles aujourd'hui

Sont disponibles à tout public :
les unités légales et établissements de diffusion publique (accessibles par sirene.fr, par les fichiers fournis par l'Insee dont ceux qui sont accessibles sur data.gouv.fr, par l'avis de situation au répertoire Sirene) ;
les unités légales et établissements en diffusion partielle, pour les variables qui ne sont pas concernées par la diffusion partielle ;
les unités légales dont les établissements ont été purgés ainsi que les établissements siège de ces unités à la date de la purge.
Cas des unités légales doublon : une même unité légale peut être identifiée dans Sirene avec 2 numéros siren différents pendant quelque temps. Les services web permettent la redirection entre l'unité qui a été créée à tort et celle qui a été doublonnée, pour les doublons qui ont été détectés.

Sont disponibles suivant droit d’accès :
les unités légales et établissements dépendant de l’article A123-96 du code de commerce (accessibles aux administrations ou organismes assimilés) ;
les unités et établissements Défense (accessibles sur autorisation du Ministère de la Défense) ;
les unités légales et établissements en diffusion partielle, pour les variables qui sont concernées par la diffusion partielle.
Ne sont pas disponibles (quel que soit le droit d’accès) :
les unités et établissements Gestion de paye de la fonction publique ;
les unités dites provisoires : une entreprise peut obtenir un numéro Siren provisoire attribué par le Guichet Unique au moment de la déclaration. Ce numéro doit ensuite être confirmé par les organismes valideurs (Chambres de Métiers, Greffes, Urssaf,...). Le Siren est diffusé uniquement lorsque sa validation est effective. Quelques rares exceptions peuvent subsister pendant le passage de Sirene 3 à Sirene 4.
Les liens de succession (API Sirene et Data.gouv uniquement)

La construction d’un lien de succession entre établissements repose sur le traitement d’une déclaration. En effet, lorsqu’un établissement est vendu (ou acheté), la norme de déclaration prévoit que la destination (ou l’origine) soit indiquée. Pour cela, il est demandé de fournir la dénomination, voire le numéro Siren, de l’acquéreur (ou du vendeur). Un lien de succession est également établi dans le cadre des déclarations de transferts d’établissements au sein de la même unité légale. Pour les entreprises des grands groupes, qui sont plus souvent concernées par des restructurations que les autres entreprises, il arrive que le lien soit fourni par l’entreprise.
Au cours de sa vie, un établissement peut avoir plusieurs prédécesseurs, voire plusieurs successeurs. En effet, un établissement peut transférer une partie de ses activités sans pour autant fermer. Lors d’une succession, un établissement peut avoir un ou plusieurs successeurs à la même date. Idem pour les prédécesseurs.
Le service renvoie tous les liens entre prédécesseurs et successeurs soit près de 7 millions de liens.

Pour chaque lien, il indique :
le siret du prédécesseur ;
le siret du successeur ;
la date du lien de succession ;
si ce lien concerne un transfert de siège ou non ;
la continuité économique* ;
la date de dernier traitement du lien.
(*) Il y a continuité économique entre deux établissements qui se succèdent dès lors que deux des trois critères suivants sont vérifiés :
les deux établissements appartiennent à la même unité légale (même Siren) ;
les deux établissements exercent la même activité (même code APE) ;
les deux établissements sont situés dans un même lieu (numéro et libellé de voie, code commune).
Ne sont pas renvoyés :
les liens concernant les établissements dont les unités légales dépendent du secteur public (État, collectivités territoriales et établissements publics) ;
les liens sur les établissements des unités purgées.
Les liens de succession sont indiqués quels que soient les statuts de diffusion des établissements prédécesseurs et successeurs.
Les unités en diffusion partielle

Toutes les unités légales et tous les établissements diffusibles ont le statut de diffusion à "O".

Les informations d'identification de personnes physiques ainsi que les informations de localisation des établissements - hormis la commune - ne sont pas diffusées pour les unités ayant fait l'objet d'une demande d'opposition et qui ont donc le statut de diffusion à "P" pour diffusion partielle. La valeur "[ND]" (Non Diffusée) remplace alors les données non diffusées.

Depuis le 21 mars 2023, la modalité non diffusible "N" n’est plus disponible, et le statut de diffusion des unités antérieurement non diffusibles "N" a été automatiquement passé à "P". Il n’y a donc plus d’unités non diffusibles "N" dans la base Sirene (dans l’API Sirene, le service des non diffusibles reste encore accessible pour le moment mais renvoie un code 404).

Interrogation unitaire du siren : obtenir l’historique complet, une période donnée ou la période courante

Obtenir l’historique complet

Il s’agit du mode d’interrogation par défaut. À partir d’un siren donné, le service permet de récupérer l'historique* complet présent dans le répertoire pour l'entreprise correspondant à ce Siren, jusqu'à la veille du jour d'interrogation.

Obtenir la période* qui englobe la date demandée

La requête passée avec le paramètre facultatif « date » permet de récupérer uniquement la période* de l'entreprise contenant la date passée en paramètre. Si le paramètre est antérieur à la première période*, le service renvoie une erreur.

Obtenir uniquement la période courante

Il suffit d'indiquer comme paramètre « date » la date du jour de l'interrogation ou une date postérieure.

(*) Certaines variables du répertoire sont disponibles pour l'ensemble des valeurs successives qu'elles ont prises au cours de la vie de l'entreprise : elles sont dites historisées ; d'autres variables ne sont disponibles que dans leur valeur courante (variables non-historisées). Une période au sens de l'API Sirene est un intervalle de temps durant lequel aucune variable historisée n'a été mise à jour.

Interrogation unitaire du siren : exemples de requête et résultats

L'API Sirene peut être interrogée directement via une requête URL ou par l'intermédiaire d'une console regroupant les principales fonctions. Pour en savoir plus

Obtenir un historique complet du siren 326 094 471 via l'URL
https://api.insee.fr/api-sirene/3.11/siren/326094471

Obtenir un historique complet via la console
siren (required) : 326094471
date :
champs :
masquerValeursNulles :

Resultat

Obtenir la situation du siren 326 094 471 au 14 mars 2000 via l'URL
https://api.insee.fr/api-sirene/3.11/siren/326094471?date=2000-03-14

Obtenir la situation du siren 326 094 471 au 14 mars 2000 via la console
siren (required) : 326094471
date : 2000-03-14
champs :
masquerValeursNulles :

Resultat

Obtenir la situation courante du siren 326 094 471 via l'URL
https://api.insee.fr/api-sirene/3.11/siren/326094471?date=2999-12-31

Obtenir la situation courante du siren 326 094 471 via la console
siren (required) : 326094471
date : 2999-12-31
champs :
masquerValeursNulles :

Interrogation unitaire du siren : Appel du service

Il s’agit d’un service web de type REST, qui s’appuie donc uniquement sur les protocoles et standards utilisés sur le web. L’invocation du service se fait par envoi d’une requête HTTPS (de type GET) sur une URL publique ; le résultat est communiqué dans le contenu de la réponse HTTPS. L’appel utilise la clé d’accès fourni par le catalogue.

URL d’accès au service avec recherche de la totalité des périodes historiques :

https://api.insee.fr/api-sirene/3.11/siren/{siren}
URL d’accès au service avec le paramètre date qui renvoie uniquement la période comprenant cette date :
https://api.insee.fr/api-sirene/3.11/siren/{siren}?date={date}

Interrogation unitaire du siren : Paramètres

{siren} est un numéro à 9 chiffres : paramètre obligatoire.
{date} est de la forme AAAA-MM-JJ : paramètre facultatif.
Interrogation unitaire du siren : En-tête de la requête

L’authentification se fait en passant votre clé d’accès dans l’en-tête Authorization.

Le seul format de données produit correspond à Accept application/json.

Le contenu de la réponse peut être compressé afin de limiter sa taille. L'algorithme de compression utilisé est le gzip.
Pour recevoir une réponse compressée, il faut ajouter dans l'en-tête HTTP le paramètre Accept-Encoding et le valoriser à gzip.

Interrogation unitaire du siren : Appel du service

Il s’agit d’un service web de type REST, qui s’appuie donc uniquement sur les protocoles et standards utilisés sur le web. L’invocation du service se fait par envoi d’une requête HTTPS (de type GET) sur une URL publique ; le résultat est communiqué dans le contenu de la réponse HTTPS. L’appel utilise la clé d’accès fourni par le catalogue.

URL d’accès au service avec recherche de la totalité des périodes historiques :

https://api.insee.fr/api-sirene/3.11/siren/{siren}
URL d’accès au service avec le paramètre date qui renvoie uniquement la période comprenant cette date :
https://api.insee.fr/api-sirene/3.11/siren/{siren}?date={date}

Interrogation unitaire du siren : Paramètres

{siren} est un numéro à 9 chiffres : paramètre obligatoire.
{date} est de la forme AAAA-MM-JJ : paramètre facultatif.
Interrogation unitaire du siren : En-tête de la requête

L’authentification se fait en passant votre clé d’accès dans l’en-tête Authorization.

Le seul format de données produit correspond à Accept application/json.

Le contenu de la réponse peut être compressé afin de limiter sa taille. L'algorithme de compression utilisé est le gzip.
Pour recevoir une réponse compressée, il faut ajouter dans l'en-tête HTTP le paramètre Accept-Encoding et le valoriser à gzip.

Interrogation unitaire du siren : résultat

Le résultat est fourni au format Json.
Le retour est structuré en 2 parties :

• le header (à ne pas confondre avec l'en-tête http ni l'en-tête de réponse) qui contient le code retour et le message d'erreur ;
• l'unité légale, qui comprend :
◦ Toutes les variables courantes
◦ La liste de toutes les périodes et, pour chaque période :
▪ La liste des variables historisées.
Les résultats des valeurs non historisées (période courante) sont envoyés avant le tableau periodes.
Le tableau periodes entre […] comprend un nombre de périodes (variable nombrePeriodesUniteLegale) entre {…} par ordre chronologique décroissant :
• une période est définie par une date de début et une date de fin ;
• les valeurs des variables historisées sont celles observées dans la période ;
• une variable non connue sur une période sera à null ;
• la dernière période de l'historique dans l'ordre chronologique correspond à la période courante et a une date de fin à null ;
• un changement de valeur pour une variable historisée implique la création d'une période ;
• des indicatrices de changement (true ou false) sont attachées à chaque variable historisée et indiquent si la variable correspondante a été modifiée par rapport à la période précédente ;
• pour la première période de l'historique de l'entreprise dans l'ordre chronologique toutes les indicatrices sont à false ;
• pour une entreprise dont les variables historisées n'ont jamais été modifiées, la réponse ne comportera qu'une seule période.
Interrogation unitaire du siren : en-tête de la réponse

L’en-tête de la réponse comprend : • Access-Control-Allow-Origin: *
• Cache-Control: private
• Connection: Keep-Alive
• Content-Encoding: gzip
• Content-Length: xxx
• Content-Type: application/json;charset=utf-8
• Date: xxx
• Expires: Thu, 01 Jan 1970 01:00:00 GMT
• Location:https://xxxxxxx (si code 301)
• Keep-Alive: timeout=5, max=100
• Server: unknown
• Vary: Accept-Encoding
• X-Frame-Options: SAMEORIGIN

Recherche multicritères : Présentation du service

Il est possible via les deux services d’interrogation sur Siren et Siret d'effectuer une recherche libre permettant de combiner la totalité des variables présentes dans la réponse du service unitaire Siren (respectivement Siret).
Cette recherche permet d’obtenir une liste des Siren (respectivement des Siret) qui répondent à des critères passés par un paramètre q (query) prenant la forme d'une requête, éventuellement complétée par les paramètres date, debut, nombre et curseur en fonction des besoins.

Appel du service

Il s’agit d’un service web de type REST, qui s’appuie donc uniquement sur les protocoles et standards utilisés sur le web.
L’invocation du service se fait par envoi d’une requête HTTPS (de type GET ou de type POST) sur une URL publique ; le résultat est communiqué dans le contenu de la réponse HTTPS.
L’appel utilise la clé d’accès fourni par le catalogue.

URL d’accès à la recherche multicritères Siren :
https://api.insee.fr/api-sirene/3.11/siren?q={requête multicritères}
URL d’accès à la recherche multicritères Siret :
https://api.insee.fr/api-sirene/3.11/siret?q={requête multicritères}
S'il y a d'autres paramètres, on peut avoir par exemple :
https://api.insee.fr/api-sirene/3.11/siren?q={requête multicritères}&date={paramètre date}
Le verbe POST permet de s'affranchir de la limite de caractères ou de connecteurs logiques présente dans les requêtes de type GET.
Pour les requêtes de type POST, les paramètres de la requête (q, nombre, etc.) sont fournis dans le corps de la requête POST et l'en-tête doit contenir "Content-Type : application/x-www-form-urlencoded".

Les recherches multicritères sont également accessibles par une console regroupant les principales fonctions.

Recherche sur une variable non-historisée

Permet de sélectionner les Siren (resp. les Siret) pour lesquels une certaine variable a une valeur spécifique. Dans le cas des variables non-historisées, il s'agit toujours de la valeur courante.

La syntaxe est la suivante : nomVariable:valeur

nomVariable doit correspondre exactement (casse comprise*) à la variable de sortie de l’interrogation unitaire. Toutes les variables peuvent être utilisées, y compris les indicatrices, avec quelques subtilités pour les variables au format date.

Exemples

Recherche de tous les établissements du Siren 775672272 : https://api.insee.fr/api-sirene/3.11/siret?q=siren:775672272
Recherche de toutes les unités purgées : https://api.insee.fr/api-sirene/3.11/siren?q=unitePurgeeUniteLegale:true
Recherche de tous les établissements des unités purgées : https://api.insee.fr/api-sirene/3.11/siret?q=unitePurgeeUniteLegale:true
Recherche de tous les établissements de la commune de Malakoff (code commune=92046) : https://api.insee.fr/api-sirene/3.11/siret?q=codeCommuneEtablissement:92046
Recherche sur une variable historisée

Permet de sélectionner les Siren (respectivement les Siret) pour lesquels une certaine variable a une valeur spécifique sur au moins une période**. Dans le cas des variables historisées, on peut obtenir leur valeur courante ou la valeur qu'elles ont eue depuis la création de l'unité légale (respectivement l'établissement).

La syntaxe est la suivante : periode(nomVariable:valeur)

nomVariable doit correspondre exactement (casse comprise*) à la variable de sortie de l’interrogation unitaire.
Toutes les variables peuvent être utilisées, y compris les indicatrices, avec quelques subtilités pour les variables au format date. L'utilisation du paramètre date permet de limiter la recherche à une seule période (qui inclut la date saisie)

(*) Les noms de variables sont au format camelcase : premier mot tout en minuscules, les suivants avec l'initiale en majuscule, sans espaces ni accents (ex: economieSocialeSolidaireUniteLegale)
(**) Une période au sens de l'API est un intervalle de temps durant lequel aucune variable historisée n'a été modifiée. Le nombre de périodes est toujours supérieur ou égal à 1, pour les unités légales comme pour les établissements

Exemples

Recherche de toutes les UL dont la dénomination contient ou a contenu le mot GAZ : https://api.insee.fr/api-sirene/3.11/siren?q=periode(denominationUniteLegale:GAZ)
Recherche de toutes les UL qui ont été cessées : https://api.insee.fr/api-sirene/3.11/siren?q=periode(etatAdministratifUniteLegale:C)
Recherche de tous les établissements dont le code de l’activité principale a été (ou est(1)) 33.01 : https://api.insee.fr/api-sirene/3.11/siret?q=periode(activitePrincipaleEtablissement:33.01)

(1) 33.01 appartenant à une ancienne nomenclature, une unité légale (resp. un établissement) ne peut pas avoir ce code en valeur courante si elle est active.
Commentaires

Pour un utilisateur n'ayant pas le droit d'accès aux données en diffusion partielle, un contrôle est fait sur chaque variable présente dans la requête multicritères (paramètre q). Les unités légales ou les établissements pour lesquels au moins l'une de ces variables est en diffusion partielle, n'apparaîtront pas dans les résultats de la recherche.
Les recherches sur variables historisées ou non-historisées sont accessibles par la console. 

Recherche par élimination

Il est possible de construire une requête en recherchant tous les établissements qui n’ont pas une caractéristique en utilisant le caractère « - ».

La syntaxe est la suivante :

-nomVariable:valeur (variables non-historisées)
periode(-nomVariable:valeur) (variables historisées)


Exemples

Recherche de tous les établissements dont l'unité légale est considérée comme une personne morale : https://api.insee.fr/api-sirene/3.11/siret?q=-categorieJuridiqueUniteLegale:1000
Recherche de tous les établissements qui n'ont jamais été fermés : https://api.insee.fr/api-sirene/3.11/siret?q=-periode(etatAdministratifEtablissement:F)

Commentaires

Il existe des unités qui ne sont pas des personnes physiques (categorieJuridiqueUniteLegale:1000) et qui n'ont pas pour autant de personnalité morale au sens juridique (Sociétés de fait, indivisions par exemple). Elles sont toutefois traitées comme des personnes morales dans le répertoire Sirene

Requête sur plusieurs variables

Les mots clés AND et OR sont autorisés et peuvent être combinés avec des parenthèses ; sans parenthèses le AND prévaut sur le OR.

La syntaxe est la suivante :

nomVariable1:valeur1 OR nomVariable2:valeur2
nomVariable1:valeur1 OR nomVariable1:valeur2
nomVariable1:valeur1 AND nomVariable2:valeur2

Pour les variables historisées :

periode(nomVariable1:valeur1 AND/OR nomVariable2:valeur2) recherchera si les conditions sont vérifiées à l'intérieur d'une période (période quelconque, ou fixée par le paramètre date).
periode(nomVariable1:valeur1) AND/OR periode(nomVariable2:valeur2) recherchera sur toutes les périodes les deux conditions séparément, c’est à dire qu'à défaut de paramètre date renseigné, il sélectionnera éventuellement une condition dans une période et une condition dans une autre période.

Il est possible de combiner variables historisées et non-historisées. Dans ce cas, les variables non-historisées n’étant disponibles que pour leur valeur courante, il est préférable de renseigner le paramètre date avec une date dans le furur, de manière à sélectionner également la valeur courante des variables historisées.

Exemples

Recherche de toutes les entreprises dont l’activité principale est 84.23Z ou 86.21Z, ou l’a été par le passé : https://api.insee.fr/api-sirene/3.11/siren?q=periode(activitePrincipaleUniteLegale:84.23Z OR activitePrincipaleUniteLegale:86.21Z)
Recherche de tous les établissements relevant des catégories juridiques 5510 et 5520 : https://api.insee.fr/api-sirene/3.11/siret?q=categorieJuridiqueUniteLegale:5510 OR categorieJuridiqueUniteLegale:5520
Recherche de tous les établissements qui ont au moins une période où leur état est « actif » et leur activité principale est 84.23Z : https://api.insee.fr/api-sirene/3.11/siret?q=periode(activitePrincipaleEtablissement:84.23Z AND etatAdministratifEtablissement:A)
Recherche de tous les établissements qui ont moins une période dont l’activitePrincipaleEtablissement est 84.23Z et qui n'ont jamais été fermés : https://api.insee.fr/api-sirene/3.11/siret?q=periode(activitePrincipaleEtablissement:84.23Z) AND -periode(etatAdministratifEtablissement:F)
Recherche de tous les établissements de Malakoff dont la dernière catégorie juridique est 9220 : https://api.insee.fr/api-sirene/3.11/siret?q=codeCommuneEtablissement:92046 AND categorieJuridiqueUniteLegale:9220
Recherche de toutes les entreprises exerçant l’activité « marchand de biens » et appartenant à la catégorie PME (Cf. supra : combinaison de variables historisées et non-historisées, paramètre date) : https://api.insee.fr/api-sirene/3.11/siren?q=periode(activitePrincipaleUniteLegale:68.10Z) AND categorieEntreprise:PME&date=2030-12-31

Commentaires

Quand les nomenclatures évoluent, les codes supprimés sont remplacés pour les unités actives, mais pas pour les unités cessées (Unités légales comme établissements).

Recherche exacte, séparateurs de mots et synonymes

La recherche exacte se fait en utilisant les guillemets doubles.


Exemple

Recherche de toutes les unités légales dont la dénomination contient exactement le terme " LE TIMBRE " : https://api.insee.fr/api-sirene/3.11/siren?q=periode(denominationUniteLegale:"LE TIMBRE")

Séparateurs de mots et synonymes

Un certain nombre de règles ont été appliquées pour faciliter la recherche : prise en compte de la casse, synonyme, mot vide, séparateur. Vous trouverez en annexe le détail de ces règles qui varient suivant les variables auxquelles s’applique la recherche.

Utilisation de caractères spéciaux : « * » et « ? »


« * » permet de remplacer une chaîne de caractères de taille quelconque.

La syntaxe est la suivante :

nomVariable:va* nomVariable (ou au moins un des mots le constituant) doit commencer par va (avec ou sans autre caractère ou mot derrière)
nomVariable:*eur nomVariable (ou au moins un des mots le constituant) doit se terminer par eur (avec ou sans autre caractère ou mot devant)
nomVariable:*ale* nomVariable (ou au moins un des mots le constituant) doit contenir la chaîne ale (avec ou sans autre caractère ou mot devant ou derrière)
nomVariable:* nomVariable ne doit pas être vide
Attention : pour les variables renvoyant une date, « * » ne fonctionne que seul (nomVariable:*).

Exemples

Recherche de tous les établissements des unités légales dont l'activité principale commence par 8 : https://api.insee.fr/api-sirene/3.11/siret?q=activitePrincipaleUniteLegale:8*
Recherche de tous les établissements des unités légales dont le sigle n'est pas rempli : https://api.insee.fr/api-sirene/3.11/siret?q=-sigleUniteLegale:*
Recherche de toutes les unités légales dont le siren ne commence ni par 1 ni par 2 (Etat et collectivités) : https://api.insee.fr/api-sirene/3.11/siren?q=-siren:1* AND -siren:2*
Recherche de toutes les unités légales dont la date de création est renseignée : https://api.insee.fr/api-sirene/3.11/siren?q=dateCreationUniteLegale:*&champs=siren,dateCreationUniteLegale
Recherche de toutes les unités légales dont la date de création n'est pas renseignée : https://api.insee.fr/api-sirene/3.11/siren?q=-dateCreationUniteLegale:*&champs=siren
Exemple de sortie CSV

Recherche de tous les établissements des unités légales dont la dénomination commence par "LAMI" : https://api.insee.fr/api-sirene/3.11/siret?q=denominationUniteLegale:lami*&champs=denominationUniteLegale
denominationUniteLegale
HERMITE STE LAMIRAND SCI
SYND.COPR. 5 7 IMP LAMIER P 11 REP PAR
MR BOURBON F MLE DURAND I MR LAMINIE
LAMINOIRS DU DAUPHINE - ETS BONMARTIN
TREFILERIES LAMINOIRS DE LA MEDITERRANEE
BOSSARD LAMICHE ET CIE SA
COMMUNE DE LAY LAMIDOU
COMMUNE DE LAMILLARIE
LAMIS
LAMISSE
...
Lorsque la dénomination ne comprend qu'un seul mot, il commence par la chaîne de caractères "LAMI" ; quand elle en comprend plusieurs, au moins un d'entre eux commence par la chaîne de caractères "LAMI"

« ? » permet de remplacer exactement un caractère.


Exemples

Recherche de tous les établissements dont l'unité légale a un sigle sur 3 positions : https://api.insee.fr/api-sirene/3.11/siret?q=sigleUniteLegale:???
Recherche de tous les établissements dont l'unité légale a un sigle qui commence par FC et est sur 3 positions exactement : https://api.insee.fr/api-sirene/3.11/siret?q=sigleUniteLegale:FC?

Utilisation du caractère spécial « ~ » : recherche approximative

« ~ » permet de faire une recherche approximative. Elle repose sur la distance de Damerau-Levenshtein, avec une valeur par défaut de deux. La syntaxe est la suivante :

nomVariable:valeur~
nomVariable:valeur~1

Ainsi la recherche /siret?q=sigleUniteLegale:maison~, va renvoyer tous les établissements des unités légales dont le sigle ressemble à maison, à une ou deux lettres ou permutations près. Par exemple : mion, raison, tiason, maisonne
En ajoutant le paramètre 1 derrière le ~, on obtient seulement les chaînes de caractères qui ne comprennent qu’une seule suppression/ajout/permutation. Il n’est pas possible de mettre autre chose que 1 ou 2 comme paramètre (sachant que 2 est inutile car c’est la valeur par défaut).


Exemples

Recherche de tous les établissements dont l'unité légale a comme prenom1UniteLegale MICKAEL à deux caractères près, mais pas MICKAEL exactement : https://api.insee.fr/api-sirene/3.11/siret?q=prenom1UniteLegale:MICKAEL~ AND -prenom1UniteLegale:MICKAEL
Recherche de tous les établissements dont l’unité légale a pour sigle PAUL à une erreur près : https://api.insee.fr/api-sirene/3.11/siret?q=sigleUniteLegale:PAUL~1


Si la recherche se fait sur plusieurs mots, la distance de Levenshtein est calculée avec des insertions, permutation de mots et non de lettres. Dans ce cas, le paramètre après le ~ peut être supérieur à 2.

Exemple (sortie en csv, plus claire pour l'illustration, mais identique en résultat à la sortie en Json)

Recherche de tous les établissements dont l'unité légale a une dénomination sociale comprenant "BLEU LE" :

Résultat sans le ~ (recherche exacte) : https://api.insee.fr/api-sirene/3.11/siret?q=denominationUniteLegale:"bleu le"&nombre=20&champs=denominationUniteLegale
PRINTEMPS BLEU LE CHOIX DE LA SANTE
Résultat avec ~2 (recherche approximative) : https://api.insee.fr/api-sirene/3.11/siret?q=denominationUniteLegale:"bleu le"~2&nombre=100&champs=denominationUniteLegale
...
LE BLEU DU CIEL VOYAGES
L'ENERGIE RENOUVELABLE - BLEU COMME LE CIEL
LE BLEU DES ILES
SCI S LE BLEU
PRINTEMPS BLEU LE CHOIX DE LA SANTE
LE BLEU MARINE
...
Commentaires

Il est possible de rechercher des valeurs approximatives sur plusieurs mots en décomposant la recherche : la requête https://api.insee.fr/api-sirene/3.11/siret?q=denominationUniteLegale:yst~ AND denominationUniteLegale:anotwer~ AND denominationUniteLegale:copany~&champs=denominationUniteLegale&nombre=1000 donne "Yet another company" en écho

Requête sur une plage de valeurs

Il est possible de rechercher sur une plage de valeurs.

La syntaxe est la suivante :

nomVariable:[valeur1 TO valeur2] bornes incluses nomVariable:{valeur1 TO valeur2} bornes exclues

Attention : Pour les requêtes sur la console, les symboles { et } doivent être saisis tels quels ; pour les requêtes url, doivent être échappés :%7B et %7D (voir exemples ci-dessous)

Exemples console

Recherche de tous les etablissements d'UL dont le nom d’usage va de DUPONT à DURAND, y compris DUPONT et DURAND :
q : nomUsageUniteLegale:[DUPONT TO DURAND]
Recherche de tous les etablissements d'UL dont le nom d’usage va de DUPONT à DURAND, non compris DUPONT et DURAND :
q : nomUsageUniteLegale:{DUPONT TO DURAND}
Recherche de tous les etablissements d'UL dont le nom d’usage va de DUPONT à DURAND, Y compris DUPONT et non compris DURAND :
q : nomUsageUniteLegale:[DUPONT TO DURAND}
Exemples url

Recherche de tous les etablissements d'UL dont le nom d’usage va de DUPONT à DURAND, y compris DUPONT et DURAND : https://api.insee.fr/api-sirene/3.11/siret?q=nomUsageUniteLegale:[DUPONT TO DURAND]
Recherche de tous les etablissements d'UL dont le nom d’usage va de DUPONT à DURAND, non compris DUPONT et DURAND : https://api.insee.fr/api-sirene/3.11/siret?q=nomUsageUniteLegale:%7BDUPONT TO DURAND%7D
Recherche de tous les etablissements d'UL dont le nom d’usage va de DUPONT à DURAND, Y compris DUPONT et non compris DURAND : https://api.insee.fr/api-sirene/3.11/siret?q=nomUsageUniteLegale:[DUPONT TO DURAND%7D

Exemple de sortie CSV

Recherche de tous les établissements de médecins généralistes dont le nombre de périodes va de 12 à 20 (inclus) :
https://api.insee.fr/api-sirene/3.11/siret?q=categorieJuridiqueUniteLegale:1000 AND activitePrincipaleUniteLegale:86.21Z AND nombrePeriodesEtablissement:[12 TO 20]&champs=siret,nombrePeriodesEtablissement
siret,nombrePeriodesEtablissement
31334539900023,15
32859956800016,12
32882929600032,12
35204040600022,12
39333255600025,13
41797549700013,13
41998955300021,14

Requête sur les variables de type date

Il est possible de faire des recherches sur les variables de type date, y compris les dates de début et de fin de période.
Les variables dates requêtables sont :


ws/siren

ws/siret

dateCreationUniteLegale

dateCreationEtablissement

dateDernierTraitementUniteLegale

dateDernierTraitementEtablissement

dateDebut

dateDebut

dateFin

dateFin


La syntaxe est la suivante :

variabledate:AAAA-MM-JJ recherche sur le jour correspondant
variabledate:AAAA-MM recherche sur le mois correspondant
variabledate:AAAA recherche sur l'année correspondante


Pour les variables dateDernierTraitementUniteLegale et dateDernierTraitementEtablissement, la précision peut aller jusu'à la milliseconde :
variabledate:AAAA-MM-JJTHH
variabledate:AAAA-MM-JJTHH:MM
variabledate:AAAA-MM-JJTHH:MM:SS
variabledate:AAAA-MM-JJTHH:MM:SS.MMM

L'utilisation des intervalles est également possible (pour voir la voir syntaxe complète : Requête sur une plage de valeurs) en combinant les possibilités (jour, mois, année et heure, minute, seconde pour les deux variables précitées) exemple :
variabledate:[2001 TO 2004-05] cherchera du 01/01/2001 inclus au 31/05/2004 inclus
variabledate:[2017 TO *] cherchera à partir du 01/01/2017

Les variables dateDebut et dateFin sont considérées comme des variables historisées, la syntaxe est donc la suivante :
periode(dateDebut:xxxx) ou periode(dateFin:xxxx)

La syntaxe valable dans la V3.2 est toujours acceptée :
variabledate:"AAAA-MM-JJT00:00:00Z"
variabledate:[ʺAAAA-MM-JJT00:00:00Zʺ TO ʺAAAA-MM-JJT00:00:00Zʺ]
etc.
Exemples

Recherche de toutes les UL dont la date de création est au 01/01/2014 : https://api.insee.fr/api-sirene/3.11/siren?q=dateCreationUniteLegale:2014-01-01
Recherche de toutes les UL dont l’année de création est entre 1980 et 2003 : https://api.insee.fr/api-sirene/3.11/siren?q=dateCreationUniteLegale:[1980 TO 2003]
Recherche de tous les établissements mis à jour au mois de février 2018 et non mis à jour depuis : https://api.insee.fr/api-sirene/3.11/siret?q=dateDernierTraitementEtablissement:2018-02
Recherche de toutes les UL qui ont eu un changement de dénomination l'année 2017 : https://api.insee.fr/api-sirene/3.11/siren?q=periode(changementDenominationUniteLegale:true AND dateDebut:2017)

Requête avec le paramètre date

L'ajout du paramètre date permet de spécifier à quelle date on souhaite que la variable interrogée ait la valeur recherchée (la variable ou les variables). Une unité légale ou un établissement répondant aux critères de sélection (q et date) sera renvoyé(e) intégralement, c'est à dire avec toutes ses périodes, contrairement à ce qui se passe en recherche unitaire. Renseigner le paramètre date avec la date du jour ou une date dans le futur permet de ne s'intéresser qu'aux valeurs courantes des variables (seule la dernière période n'a pas de date de fin).

La syntaxe est la suivante :

- requête url : ?q={requête}&date=AAAA-MM-JJ

- requête console :

q : {requête}
date : AAAA-MM-JJ

Exemples

Recherche de toutes les UL actives au 18/09/2009 : https://api.insee.fr/api-sirene/3.11/siren?q=periode(etatAdministratifUniteLegale:A)&date=2009-09-18
Recherche de tous les établissements de Malakoff dont l’activitePrincipaleEtablissement est 56.10A (restauration traditionnelle) et actifs au 01/01/2018 : https://api.insee.fr/api-sirene/3.11/siret?q=periode(etatAdministratifEtablissement:A AND activitePrincipaleEtablissement:56.10A) AND codeCommuneEtablissement:92046 &date=2018-01-01

Commentaires

Attention à l’utilisation du paramètre date avec une recherche sur des variables non historisées : le service ne renverra que des unités légales (resp. établissements) existant à la date passée en paramètre. Par exemple, la recherche de tous les établissements du siren 212800130, avec paramètre date au 4 juillet 1980 (https://api.insee.fr/api-sirene/3.11/siret?q=siren:212800130&champs=siret,denominationUniteLegale,dateCreationEtablissement&date=1980-07-04) donne une erreur 404 (aucun écho), même si siren est une variable non-historisée, parce qu'aucun siret du siren 212800130 n'existe au 4 juillet 1980

Résultat des requêtes multicritères

Format Json

Les réponses sont par défaut en JSON et renvoient les Siren (resp les Siret) répondant à la requête avec la totalité des périodes pour les variables historisées. Le header est complété par le nombre total de résultats de la requête (total), le rang de début et le nombre de résultats effectivement retournés (20 par défaut) et, si le paramètre curseur est utilisé, le curseur et le curseur suivant. Pour l'utilisation des paramètres nombre et debut, consulter la pagination des résultats ; pour curseur, consulter la page dédiée

Exemple

Recherche de tous les établissement dont le siren commence par 3 : https://api.insee.fr/api-sirene/3.11/siret?q=siren:3*&champs=siret,denominationUniteLegale&curseur=*
Header :

X-Frame-Options: SAMEORIGIN
Cache-Control: no-cache
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST,GET
Content-Encoding: gzip
Vary: Accept-Encoding
Expires: Thu, 01 Jan 1970 00:00:00 GMT
X-Total-Count: 8738318
Access-Control-Allow-Headers: authorization,Access-Control-Allow-Origin,Content-Type,SOAPAction
Link: ; rel="first", ; rel="next"
Content-Type: application/json;charset=utf-8
Date: Tue, 08 Mar 2022 10:03:34 GMT
Transfer-Encoding: chunked
Connection: keep-alive
Strict-Transport-Security: max-age=100000; includeSubDomains

Complément :
{
    "header": {
        "statut": 200,
        "message": "OK",
        "total": 8738318,
        "debut": 0,
        "nombre": 20,
        "curseur": "*",
        "curseurSuivant": "AoEuMzAwMDAwMzUzMDAwMTU="
Vient ensuite la liste des unités légales (resp. des établissements), chacun étant structuré comme le résultat des requêtes unitaires siren ou siret.
Format csv

Le retour peut être fourni au format CSV par négociation du contenu via le paramètre Accept de l’en-tête http : accept:text/csv.
Le retour contient alors la valeur des variables non historisées et uniquement la valeur courante des variables historisées.
Exemple

Recherche de tous les établissements dont le siren commence par 3 : https://api.insee.fr/api-sirene/3.11/siret?q=siren:3*&champs=siret,denominationUniteLegale
Header :

X-Frame-Options: SAMEORIGIN
Cache-Control: no-cache
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST,GET
Content-Encoding: gzip
Vary: Accept-Encoding
Expires: Thu, 01 Jan 1970 00:00:00 GMT
X-Total-Count: 8738318
Access-Control-Allow-Headers: authorization,Access-Control-Allow-Origin,Content-Type,SOAPAction
Link: ; rel="first", ; rel="next"
Content-Type: text/csv;charset=utf-8
Date: Tue, 08 Mar 2022 10:43:05 GMT
Transfer-Encoding: chunked
Connection: keep-alive
Strict-Transport-Security: max-age=100000; includeSubDomains

Sortie :
siret,denominationUniteLegale
30000001500010,
30000002300014,
30000004900019,
30000007200029,
30000008000014,
30000009800032,
30000009800040,

Pagination des résultats : paramètres debut, nombre, tri

Tous les résultats des recherches multicritères sont renvoyés par page. Plusieurs paramètres peuvent être passés dans l’URL pour paramétrer la page. Les paramètres possibles et les limites de valeur des paramètres dépendent du type de sortie demandé (JSON ou CSV).


Paramètres de pagination recommandés

paramètre

Format demandé : JSON

Format demandé : CSV

possible

valeur limite inférieure

valeur limite supérieure

possible

valeur limite inférieure

valeur limite supérieure

nombre

oui

0

1 000

oui

0

200 000

debut

oui

0

1 000

oui

0

10 000

tri

oui

Sans objet

Sans objet

Automatique

Sans objet

Sans objet


{nombre} d’unités légales ou établissements à afficher par page. La valeur par défaut est 20 réponses par page.
{debut} correspond au rang de classement du premier établissement à afficher sur la page. La valeur par défaut est 0 (attention 0 correspond au premier établissement).
Attention : lorsque vous souhaitez utiliser le paramètre {debut}, il est fortement recommandé d'utiliser le paramètre {tri}.
{tri} indique si les résultats doivent ou non être triés. Par défaut le paramètre vaut false afin de favoriser la performance de l'appel. Dans ce cas, les résultats sont triés par un score de pertinence. Si plusieurs éléments obtiennent le même score ils peuvent arriver dans n'importe quel ordre et cet ordre peut varier d'une interrogation à l'autre. En fixant le paramètre à true, les éléments obtenant le même score seront classés par siren ou siret selon la collection interrogée. Ce paramétrage à true est fortement recommandé lorsque le paramètre {debut} est utilisé. Le paramètre true est inactif pour la sortie au format CSV (tri automatique par siren ou siret croissant).

Il est possible de paramétrer un tri sur une ou plusieurs variables, en remplissant la zone {tri} par :
- le nom d'une une variable non-historisée ;
- une liste de plusieurs noms de variables non-historisées, séparées par des virgules, sans espace
Pour chaque variable, il peut être précisé si le tri doit être ascendant (asc) ou descendant (desc) ; en l'absence de précision, le tri sera ascendant. Les tris sont appliqués dans l'ordre de la liste.
Exemples de tris

Tri ascendant sur une variable. Recherche de toutes les unités légales ayant exactement wilfrid en premier prénom et dont le deuxième prénom est renseigné, triée sur le deuxième prénom (tri ascendant par défaut) :
https://api.insee.fr/api-sirene/3.11/siren?q=prenom1UniteLegale:"wilfrid" AND prenom2UniteLegale:*&tri=prenom2UniteLegale&champs=prenom1UniteLegale,prenom2UniteLegale
 "header": {
        "statut": 200,
        "message": "OK",
        "total": 715,
        "debut": 0,
        "nombre": 20
    },
    "unitesLegales": [
        {
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "ADOLPHE"
        },
        {
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "ADRIEN"
        },
        {
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "AIME-CLAUDE"
        },
        {
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "ALAIN"
        },
		...
Tri descendant sur une variable. Recherche de toutes les unités légales ayant exactement wilfrid en premier prénom et dont le deuxième prénom est renseigné, triée sur le deuxième prénom (tri descendant) :
https://api.insee.fr/api-sirene/3.11/siren?q=prenom1UniteLegale:"wilfrid" AND prenom2UniteLegale:*&tri=prenom2UniteLegale desc&champs=prenom1UniteLegale,prenom2UniteLegale
    "header": {
        "statut": 200,
        "message": "OK",
        "total": 715,
        "debut": 0,
        "nombre": 20
    },
    "unitesLegales": [
        {
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "ZEPHIRIN"
        },
        {
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "YVON"
        },
        {
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "YVES"
        },
        {
            "prenom1UniteLegale": "WILFRID YVAN",
            "prenom2UniteLegale": "YVAN"
        },
		...
Tri ascendant sur plusieurs variables. Recherche de toutes les unités légales ayant exactement wilfrid en premier prénom et dont le deuxième prénom commence par un "e", triée sur le deuxième prénom puis le siren (tri ascendant par défaut sur les deux variables) :
https://api.insee.fr/api-sirene/3.11/siren?q=prenom1UniteLegale:"wilfrid" AND prenom2UniteLegale:e*&tri=prenom2UniteLegale,siren&champs=prenom1UniteLegale,prenom2UniteLegale,siren
   "header": {
        "statut": 200,
        "message": "OK",
        "total": 34,
        "debut": 0,
        "nombre": 20
    },
    "unitesLegales": [
        {
            "siren": "443659180",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDDY"
        },
        {
            "siren": "903283885",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDDY"
        },
        {
            "siren": "382347003",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDGARD"
        },
        {
            "siren": "517874855",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDGARD"
        },
        {
            "siren": "342548567",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDOUARD"
        },
		...
Tri ascendant sur plusieurs variables. Recherche de toutes les unités légales ayant exactement wilfrid en premier prénom et dont le deuxième prénom commence par un "e", triée sur le deuxième prénom (ascendant par défaut) puis le siren (tri descendant) :
https://api.insee.fr/api-sirene/3.11/siren?q=prenom1UniteLegale:"wilfrid" AND prenom2UniteLegale:e*&tri=prenom2UniteLegale,siren desc&champs=prenom1UniteLegale,prenom2UniteLegale,siren
"header": {
        "statut": 200,
        "message": "OK",
        "total": 34,
        "debut": 0,
        "nombre": 20
    },
    "unitesLegales": [
        {
            "siren": "903283885",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDDY"
        },
        {
            "siren": "443659180",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDDY"
        },
        {
            "siren": "517874855",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDGARD"
        },
        {
            "siren": "382347003",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDGARD"
        },
        {
            "siren": "353785330",
            "prenom1UniteLegale": "WILFRID",
            "prenom2UniteLegale": "EDOUARD"
        },
		...
Commentaires

Le tri ne doit pas être utilisé avec les curseurs.

Pagination des résultats : utilisation du paramètre curseur (format JSON uniquement)

Si vous désirez parcourir un grand nombre de résultats, notamment pour obtenir des résultats au-delà de la limite indiquée dans le tableau (1000), il est fortement recommandé d’utiliser des curseurs.

Utilisation :

À votre première requête, ajouter le paramètre curseur=*.
Le retour de la requête contiendra la variable CurseurSuivant qui donnera la valeur à attribuer au paramètre curseur pour obtenir la page suivante.
Quand la valeur de CurseurSuivant dans le résultat est la même que celle envoyée avec la requête (variable Curseur) il n’y a plus de résultat à récupérer.


Exemple

Recherche de tous les établissements actifs des associations et assimilés (catégorie juridique commençant par 92) du 1er arrondissement de Paris :
Décompte : https://api.insee.fr/api-sirene/3.11/siret?q=periode(etatAdministratifEtablissement:A) AND categorieJuridiqueUniteLegale:92* AND codeCommuneEtablissement:75101&nombre=0
 "header": {
        "statut": 200,
        "message": "OK",
        "total": 2628,
        "debut": 0,
        "nombre": 0
...
1ère requête avec curseur : https://api.insee.fr/api-sirene/3.11/siret?q=periode(etatAdministratifEtablissement:A) AND categorieJuridiqueUniteLegale:92* AND codeCommuneEtablissement:75101&nombre=1000&curseur=*
 "header": {
        "statut": 200,
        "message": "OK",
        "total": 2628,
        "debut": 0,
        "nombre": 1000,
        "curseur": "*",
        "curseurSuivant": "AoEuNDI4MjEyMzM2MDAwMjE="
    },
    "etablissements": [
        {
            "siren": "300227279",
            "nic": "00050",
            "siret": "30022727900050",
...
...
2ème requête avec curseur : https://api.insee.fr/api-sirene/3.11/siret?q=periode(etatAdministratifEtablissement:A) AND categorieJuridiqueUniteLegale:92* AND codeCommuneEtablissement:75101&nombre=1000&curseur=AoEuNDI4MjEyMzM2MDAwMjE=
     "header": {
        "statut": 200,
        "message": "OK",
        "total": 2628,
        "debut": 0,
        "nombre": 1000,
        "curseur": "AoEuNDI4MjEyMzM2MDAwMjE=",
        "curseurSuivant": "AoEuNzg0MjA0NDU1MDAwMjU="
    },
    "etablissements": [
        {
            "siren": "428415889",
            "nic": "00016",
            "siret": "42841588900016",
...
...
3ème requête avec curseur : https://api.insee.fr/api-sirene/3.11/siret?q=periode(etatAdministratifEtablissement:A) AND categorieJuridiqueUniteLegale:92* AND codeCommuneEtablissement:75101&nombre=1000&curseur=AoEuNzg0MjA0NDU1MDAwMjU=
     "header": {
        "statut": 200,
        "message": "OK",
        "total": 2628,
        "debut": 0,
        "nombre": 628,
        "curseur": "AoEuNzg0MjA0NDU1MDAwMjU=",
        "curseurSuivant": "AoEuOTEwODUyNTMyMDAwMTk="
    },
    "etablissements": [
        {
            "siren": "784205494",
            "nic": "00064",
            "siret": "78420549400064",
...
...
4ème requête avec curseur : https://api.insee.fr/api-sirene/3.11/siret?q=periode(etatAdministratifEtablissement:A) AND categorieJuridiqueUniteLegale:92* AND codeCommuneEtablissement:75101&nombre=1000&curseur=AoEuOTEwODUyNTMyMDAwMTk=
     "header": {
        "statut": 200,
        "message": "OK",
        "total": 2628,
        "debut": 0,
        "nombre": 0,
        "curseur": "AoEuOTEwODUyNTMyMDAwMTk=",
        "curseurSuivant": "AoEuOTEwODUyNTMyMDAwMTk="
    },
    "etablissements": []
Commentaires

La dernière requête renvoie 0 unités et curseur = curseurSuivant.
Ne pas utiliser le paramètre tri avec les curseurs.

Recherche multicritères : en-tête et variables de la réponse

L’en-tête fourni lors des interrogations unitaires...

• Access-Control-Allow-Origin: *
• Cache-Control: private
• Connection: Keep-Alive
• Content-Encoding: gzip
• Content-Length: xxx
• Content-Type: application/json;charset=utf-8
• Date: xxx
• Expires: Thu, 01 Jan 1970 01:00:00 GMT
• Keep-Alive: timeout=5, max=100
• Server: unknown
• Vary: Accept-Encoding
• X-Frame-Options: SAMEORIGIN
...est complété avec la variable Link. La variable link donne la requête permettant d’obtenir la page suivante(rel="next") sauf pour la dernière tranche de résultats, la requête pour la première page (rel="first") et celle pour la dernière page (rel="last") ainsi que la page précédente (rel="previous") sauf pour la première tranche de résultats.

Les variables de la réponse sont identiques aux variables fournies par les services unitaires siren et siret.


Toutes les unités légales et tous les établissements diffusibles ont le statut de diffusion à "O".

Les informations d'identification de personnes physiques ainsi que les informations de localisation des établissements - hormis la commune - ne sont pas diffusées pour les unités ayant fait l'objet d'une demande d'opposition et qui ont donc le statut de diffusion à "P" pour diffusion partielle. La valeur "[ND]" (Non Diffusée) remplace alors les données non diffusées.

Depuis le 21 mars 2023, la modalité non diffusible "N" n’est plus disponible, et le statut de diffusion des unités antérieurement non diffusibles "N" a été automatiquement passé à "P". Il n’y a donc plus d’unités non diffusibles "N" dans la base Sirene.

Liste de variables masquées si 
statutDiffusionUniteLegale:P 

PM - Personnes MORALES

PP - Personnes PHYSIQUES

sigleUniteLegale

sigleUniteLegale

sexeUniteLegale

sexeUniteLegale

prenom1UniteLegale

prenom1UniteLegale

prenom2UniteLegale

prenom2UniteLegale

prenom3UniteLegale

prenom3UniteLegale

prenom4UniteLegale

prenom4UniteLegale

prenomUsuelUniteLegale

prenomUsuelUniteLegale

pseudonymeUniteLegale

pseudonymeUniteLegale

nomUniteLegale

nomUniteLegale

nomUsageUniteLegale

nomUsageUniteLegale

denominationUniteLegale

denominationUsuelle1UniteLegale

denominationUsuelle2UniteLegale

denominationUsuelle3UniteLegale



Liste de variables masquées si 
statutDiffusionEtablissement:P 

PM - Personnes MORALES

PP - Personnes PHYSIQUES

complementAdresseEtablissement

complementAdresseEtablissement

numeroVoieEtablissement

numeroVoieEtablissement

indiceRepetitionEtablissement

indiceRepetitionEtablissement

dernierNumeroVoieEtablissement

dernierNumeroVoieEtablissement

indiceRepetitionDernierNumeroVoieEtablissement

indiceRepetitionDernierNumeroVoieEtablissement

typeVoieEtablissement

typeVoieEtablissement

libelleVoieEtablissement

libelleVoieEtablissement

codePostalEtablissement

codePostalEtablissement

distributionSpecialeEtablissement

distributionSpecialeEtablissement

codeCedexEtablissement

codeCedexEtablissement

libelleCedexEtablissement

libelleCedexEtablissement

identifiantAdresseEtablissement

identifiantAdresseEtablissement

coordonneeLambertAbscisseEtablissement

coordonneeLambertAbscisseEtablissement

coordonneeLambertOrdonneeEtablissement

coordonneeLambertOrdonneeEtablissement

complementAdresse2Etablissement

complementAdresse2Etablissement

numeroVoie2Etablissement

numeroVoie2Etablissement

indiceRepetition2Etablissement

indiceRepetition2Etablissement

typeVoie2Etablissement

typeVoie2Etablissement

libelleVoie2Etablissement

libelleVoie2Etablissement

codePostal2Etablissement

codePostal2Etablissement

distributionSpeciale2Etablissement

distributionSpeciale2Etablissement

codeCedex2Etablissement

codeCedex2Etablissement

libelleCedex2Etablissement

libelleCedex2Etablissement

enseigne1Etablissement

enseigne2Etablissement

enseigne3Etablissement

denominationUsuelleEtablissement



Siren

Un numéro d’identité de l’unité légale est attribué par l’Insee à toutes les personnes physiques ou morales inscrites au répertoire ainsi qu’à leurs établissements : le numéro Siren. Ce numéro unique est « attribué soit à l’occasion des demandes d’immatriculation au registre du commerce et des sociétés ou des déclarations effectuées au répertoire des métiers, soit à la demande d’administrations » (article R123-224 du code de commerce). Lors de sa création, une unité légale se voit attribuer un numéro Siren de 9 chiffres.
Règles de gestion

Les entrepreneurs individuels, ou personnes physiques, conservent le même numéro Siren jusqu’à leur décès. Les sociétés, ou personnes morales, perdent la personnalité juridique au moment de la cessation de l’activité de l’entreprise. Si l’activité devait reprendre ultérieurement, un nouveau numéro Siren sera attribué. Les numéros d’identification sont uniques : lorsqu’un numéro Siren a été attribué, il ne peut pas être réutilisé et attribué à une nouvelle unité légale, même lorsque l’activité a cessé.
Historique

Même si la mise en place du répertoire Sirene remonte à 1973, toutes les unités légales, y compris celles créées avant cette date, disposent d’un numéro Siren pour le secteur privé non agricole. En 1983, le champ du répertoire Sirene et l’obligation d’immatriculation ont été étendus aux institutions et services de l’État et aux collectivités territoriales. En 1993, le champ du répertoire Sirene et l’obligation d’immatriculation ont été étendus au secteur privé agricole.
Type

Non-historisé. Numérique de longueur 9.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	oui	oui


Haut de page


activitePrincipaleUniteLegale

Lors de son inscription au répertoire, l’Insee attribue à toute unité légale un code dit « APEN* » sur la base de la description de l’activité principale faite par le déclarant. Ce code est modifiable au cours de la vie de l’unité légale en fonction des déclarations de l’exploitant. Pour chaque unité légale, il existe à un instant donné un seul code « APEN ». Il est attribué selon la nomenclature en vigueur. La nomenclature en vigueur à la date de la mise en place de l’API-Sirene est la Naf Rév2 et ce depuis le 01 Janvier 2008. Chaque code comporte 4 chiffres et une lettre. Toutes les unités légales actives au 01/01/2008 ont eu leur code APE recodé dans la nouvelle nomenclature, ainsi de très nombreuses entreprises ont une période débutant à cette date.

Les personnes morales ont la possibilité de s'immatriculer sans activité (elles déclarent alors leur commencement d'activité dans un second temps, dans les 12 mois suivant la création) : dans ce cas, l'Insee attribue le code APEN 00.00Z jusqu'à la prise d'activité.

(*) Activité Principale de l'ENtreprise. Par ailleurs, chaque établissement se voit attribuer un APET (Activité Principale de l'Etablissement), selon la même méthode.
La règle d’historisation des données d’activité est la suivante :
Pour les entreprises cessées avant le 31/12/2004, seul le dernier code activité connu figure, dans la nomenclature en vigueur à la date de fermeture.
Pour les entreprises actives après le 01/01/2005 et cessées avant le 31/12/2007, l’historique des codes attribués sur la période est disponible.
Pour les entreprises actives après le 01/01/2005 et toujours actives le 1/1/2008, l’historique intègre le changement de nomenclature.
Pour les entreprises créées après le 01/01/2008, l’historique comprend les modifications apportées au cours de la vie de l’entreprise.
Liens vers les nomenclatures d'activités successives
Date

Nomenclature

Liens

Depuis le 1er janvier 2015

NAF rév 2.

Lien

Du 1er janvier 2008 au 31 décembre 2014

NAF rév 2, 2008

Lien

Du 1er janvier 2003 au 31 décembre 2007

NAF rév 1, 2003

Lien

Du 1er janvier 1993 au 31 décembre 2002

NAF 1993

Lien

Du 1er janvier 1973 au 31 décembre 1992

NAP

Lien


L'APE peut être à null (cas des unités purgées, première date de début de l'APE postérieure à la première date de début d'une autre variable historisée)
Type

Historisé. Liste de codes, de longueur 6.
La variable nomenclatureActivitePrincipaleUniteLegale indique à quelle nomenclature d'activité appartient le code.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


anneeCategorieEntreprise

C'est l'année de validité correspondant à la catégorie d'entreprise diffusée.
Type

Non-historisé. Date, de longueur 4, format AAAA.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


anneeEffectifsUniteLegale

Année de validité de la tranche d'effectif salarié de l'unité légale.

La mise à jour des tranches d'effectifs est annuelle (automne). Les unités mises à jour voient leur année de validité des effectifs actualisée (variable renseignée l'année précédente) ou initialisée (nouveaux employeurs). Les unités non mises à jour gardent leur millésime antérieur. Pour les unités actives qui ne sont pas mises à jour deux années de suite, la variable anneeEffectifsUniteLegale renvoie "null". Il n'y a donc jamais plus de deux millésimes différents.
Type

Non-historisé. Date, de longueur 4, format AAAA, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


caractereEmployeurUniteLegale

Caractère employeur de l'unité légale.

Type

La variable n'est plus gérée, toujours null.

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
Jusqu'à Sirene 4	Jusqu'à Sirene 4	non	non


Haut de page


categorieEntreprise

Catégorie d'entreprise de l'unité légale.

La catégorie d'entreprise est une variable statistique calculée par l'Insee. Ce n'est pas une variable du répertoire Sirene.

La variable categorieEntreprise est associée à une année de validité.
Type

Non-historisé. Liste de codes, de longueur 3.
Format :
PME : petite ou moyenne entreprise
ETI : entreprise de taille intermédiaire
GE : grande entreprise
null : donnée manquante ou "sans objet"
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


categorieJuridiqueUniteLegale

Catégorie juridique de l'unité légale.

La catégorie juridique est un attribut des unités légales. Pour une personne physique, elle vaut toujours 1000, que la personne soit artisan, commerçant, profession libérale, agriculteur ou autre, et ne peut changer ; pour les personnes morales, la catégorie juridique est susceptible d'évoluer au cours de la vie de l'entreprise.

Le code est attribué selon la nomenclature en vigueur, mais peut être à null (cas des unités purgées notamment). Le libellé associé aux codes des catégories juridiques n'est pas historisé : pour les unités cessées à une date antérieure à l'entrée en vigueur de la derniere nomenclature, le libellé « Hors nomenclature » est affiché.
Type

Historisé. Liste de codes, de longueur 4.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


dateCreationUniteLegale

Date de création de l'unité légale.

La date de création correspond à la date déclarée lors du dépôt des formalités de création.
Pour les unités purgées (unitePurgeeUniteLegale=true) : si la date de création est au 01/01/1900 dans Sirene, la date est forcée à null. Dans tous les autres cas, la date de création n'est jamais à null. Si elle est non renseignée, elle sera au 01/01/1900. La date de création ne correspond pas obligatoirement à dateDebut de la première période de l'unité légale. Certaines variables historisées peuvent posséder des dates de début soit au 01/01/1900, soit antérieures à la date de création.
Type

Non-historisé. Format date, de longueur 10 (AAAA-MM-JJ) ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


dateDernierTraitementUniteLegale

Date de la dernière modification d'une variable de niveau unité légale, qu'elle soit historisée ou non.

Cette date peut concerner des mises à jour de données du répertoire Sirene qui ne sont pas diffusées. Cette variable peut être à null.
Type

Non-historisé. Format date, de longueur 23 (AAAA-MM-JJTHH:MM:SS.MMM) ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


denominationUniteLegale

Cette variable désigne la raison sociale pour les personnes morales. Il s'agit du nom sous lequel est déclarée l'unité légale. Cette variable est à null pour les personnes physiques. La dénomination peut parfois contenir la mention de la forme de la société (SA, SAS, SARL, etc.).

Le répertoire Sirene gère des caractères majuscules non accentués.
Il gère également des caractères spéciaux tel que - & + @ ! ? * ° . % :  # | (liste non exhaustive).
Type

Historisé. Format texte, de longueur 130, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


denominationUsuelle1UniteLegale, denominationUsuelle2UniteLegale, denominationUsuelle3UniteLegale

Dénomination usuelle de l'unité légale.

Cette variable facultative désigne le nom (ou les noms) sous lequel l'entreprise est connue du grand public (nom commercial de l'unité légale). Cet élément d'identification de l'entreprise (sur trois champs : denominationUsuelle1UniteLegale, denominationUsuelle2UniteLegale et denominationUsuelle3UniteLegale) a été enregistré au niveau unité légale avant l'application de la norme d'échanges CFE de 2008. À partir de la norme 2008, la dénomination usuelle est enregistrée au niveau de l'établissement sur un seul champ : denominationUsuelleEtablissement.

Les 3 variables sont historisées avec une seule indicatrice de changement pour les trois variables.
Type

Historisé. Format texte, de longueur 70, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


economieSocialeSolidaireUniteLegale

Appartenance au champ de l'économie sociale et solidaire.

Cette variable indique si l'entreprise appartient au champ de l'économie sociale et solidaire. La loi n° 2014-856 du 31 juillet 2014 définit officiellement le périmètre de l'économie sociale et solidaire (ESS). Celle-ci comprend les quatre familles traditionnelles en raison de leur régime juridique (associations, fondations, coopératives et mutuelles) et inclut une nouvelle catégorie, les entreprises de l'ESS, adhérant aux mêmes principes :
poursuivre un but social autre que le seul partage des bénéfices ;
un caractère lucratif encadré (notamment des bénéfices majoritairement consacrés au maintien et au développement de l'activité) ;
une gouvernance démocratique et participative.
Cette variable est renseignée pour environ 1 million d'entreprises, sinon null.
Type

Historisé. Liste de codes, de longueur 1, ou null.

Modalités :
O : l'entreprise appartient au champ de l'économie sociale et solidaire ;
N : l'entreprise n'appartient pas au champ de l'économie sociale et solidaire.

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


etatAdministratifUniteLegale

État administratif de l'unité légale.

Le passage à l'état « Cessée » découle de la prise en compte d'une déclaration de cessation administrative :
Pour les personnes morales, cela signifie disparition de la personne morale : l'état administratif "Cessée" est a priori irréversible. Cependant, il existe actuellement dans la base un certain nombre d'unités légales personnes morales avec un historique d'état présentant un état cessé entre deux périodes à l'état actif.
Pour les personnes physiques, cela signifie une cessation totale d'activité, décidée ou contrainte (décès, faillite). Hormis en cas de décès, la personne physique est susceptible d'être réactivée (même siren), en cas re reprise d'activité (identique ou non), sans condition de délai.
En règle générale, la première période d'historique d'une unité légale correspond à un etatAdministratifUniteLegale égal à « Active ». Toutefois, l'état administratif peut être à null (première date de début de l'état postérieure à la première date de début d'une autre variable historisée).
Type

Historisé. Liste de codes, de longueur 1, ou null.
A : l'entreprise est administrativement active (même mise en sommeil, c'est à dire avec tous ses établissements fermés) ;
C : l'entreprise est administrativement cessée.

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


identifiantAssociationUniteLegale

Numéro au Répertoire National des Associations (RNA).

Lors de sa déclaration en préfecture, l'association reçoit automatiquement un numéro d'inscription au RNA. Elle doit en outre demander son immatriculation au répertoire Sirene lorsqu'elle souhaite demander des subventions auprès de l'État ou des collectivités territoriales, lorsqu'elle emploie des salariés ou lorsqu'elle exerce des activités qui conduisent au paiement de la TVA ou de l'impôt sur les sociétés. Le RNA est le fichier national, géré par le ministère de l'Intérieur, qui recense l'ensemble des informations sur les associations.
Type

Non-historisé. Texte longueur 10, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


nicSiegeUniteLegale

Numéro interne de classement (Nic) de l'établissement siège de l'unité légale.

Toutes les unités légales ont un établissement siège :
Pour les personnes morales, il s'agit d'une donnée juridique. Le transfert du siège d'un établissement à un autre fait l'objet d'une formalité et entraîne le changement de nicSiegeUniteLegale.
Pour les personnes physiques, le siège n'a pas de réalité juridique, mais le répertoire calque la structure des personnes physiques sur celle des personnes morales, et attribue la qualité de siège au premier établissement créé : le transfert de siège est géré à partir des formalités de création, transfert ou fermeture d'établissement(s).
Le Nic du siège peut être à null sur une période mais, en règle générale, pas sur l'ensemble de l'historique (cas des unités purgées, première date de début du Nic postérieure à la première date de début d'une autre variable historisée).
Type

Historisé. Texte de longueur 5 (numérique), ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


nombrePeriodesUniteLegale

Nombre de périodes de l'unité légale.

Chaque période correspond à un intervalle de temps pendant lequel aucune des variables historisées de l'unité légale n'est modifiée. Les dates de ces périodes sont des dates d'effet (et non des dates de traitement).
Type

Non-historisé. Longueur 2, numérique.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
non	oui	non

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


nomenclatureActivitePrincipaleUniteLegale

Nomenclature d'activité de la variable activitePrincipaleUniteLegale.

Cette variable indique la nomenclature d'activité correspondant à la variable activitePrincipaleUniteLegale. Toutes les unités légales actives ont un code d'activité principale appartenant à la nomenclature la plus récente ; les unités légales cessées ont un code appartenant à la nomenclature en vigueur à la date de prise en compte de leur cessation. La variable nomenclatureActivitePrincipaleUniteLegale est à null si la variable activitePrincipaleUniteLegale est à null
Type

Historisé. Liste de codes, longueur 8, ou null.
NAFRev2
NAFRev1
NAF1993
NAP
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


nomUniteLegale

Nom de naissance de la personnes physique.

Cette variable est à null pour les personnes morales. Le répertoire Sirene ne gère que des caractères majuscules non accentués et uniquement les caractères spéciaux tiret (-) et apostrophe. Le nom peut être à null pour une personne physique (cas des unités purgées, première date de début du nom postérieure à la première date de début d'une autre variable historisée).
Type

Historisé. Texte de longueur 100, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


nomUsageUniteLegale

Nom d'usage de la personne physique.

Le nom d'usage est celui que la personne physique a choisi d'utiliser. Cette variable est à null pour les personnes morales. Le répertoire Sirene ne gère que des caractères majuscules non accentués et uniquement les caractères spéciaux tiret (-) et apostrophe. Le nom peut être à null pour une personne physique (cas des unités purgées, première date de début du nom postérieure à la première date de début d'une autre variable historisée).
Type

Historisé. Texte de longueur 100, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


prenom1UniteLegale à prenom4UniteLegale

Prénom(s) déclaré(s) pour une personne physique.

Les variables prenom1UniteLegale à prenom4UniteLegale sont les prénoms déclarés pour une personne physique. Ces variables sont à null pour les personnes morales. Toute personne physique sera identifiée au minimum par son nom de naissance et son premier prénom. Toutefois, il existe des personnes physiques pour lesquelles le nom est renseigné alors que les 4 prénoms sont à null. Les prenom1UniteLegale à prenom4UniteLegale peuvent contenir des *, qui ne sont pas significatifs.
Type

Non-historisé. Texte longueur 20, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


prenomUsuelUniteLegale

Prénom usuel de la personne physique.

Le prénom usuel est le prénom par lequel une personne choisit de se faire appeler dans la vie courante, parmi l'ensemble de ceux qui lui ont été donnés à sa naissance et qui sont inscrits à l'état civil. Il correspond généralement au prenom1UniteLegale. Toutefois, il existe des personnes physiques pour lesquelles le nom est renseigné alors que le prénom usuel est à null. Cette variable est à null pour les personnes morales.
Type

Non-historisé. Texte longueur 20, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


pseudonymeUniteLegale

Pseudonyme de la personne physique.

Cette variable correspond au nom qu'une personne utilise pour se désigner dans l'exercice de son activité, généralement littéraire ou artistique.
Type

Non-historisé. Texte longueur 100, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


sexeUniteLegale

Caractère féminin ou masculin de la personne physique.

Cette variable est à null pour les personnes morales, ainsi que pour quelques personnes physiques.
Type

Non-historisé. Longueur 4. Liste de codes, ou null, ou [ND] si l'unité est en diffusion partielle :
F : Féminin
M : Masculin
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


sigleUniteLegale

Sigle de l'unité légale.

Un sigle est une forme réduite de la raison sociale ou de la dénomination d'une personne morale ou d'un organisme public. Il est habituellement constitué des initiales de certains des mots de la dénomination. Afin d'en faciliter la prononciation, il arrive qu'on retienne les deux ou trois premières lettres de certains mots : il s'agit alors, au sens strict, d'un acronyme; mais l'usage a étendu à ce cas l'utilisation du terme sigle. Cette variable est à null pour les personnes physiques ; facultative, elle peut également être à null pour les personnes morales.
Type

Non-historisé. Texte de longueur 20, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


societeMissionUniteLegale

Appartenance au champ des sociétés à mission.

Cette variable indique si l'entreprise appartient au champ des sociétés à mission. L'article 176 de la loi du 22 mai 2019 relative à la croissance et la transformation des entreprises, dite loi Pacte, introduit la qualité de société à mission. Il permet à une société de faire publiquement état de la qualité de société à mission en précisant sa raison d'être ainsi qu’un ou plusieurs objectifs sociaux et environnementaux que la société se donne pour mission de poursuivre dans le cadre de son activité.
Type

Historisé. Liste de codes, de longueur 1, ou null.

Modalités :
O : l'entreprise appartient au champ des sociétés à mission ;
N : l'entreprise n'appartient pas au champ des sociétés à mission.

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


statutDiffusionUniteLegale

Statut de diffusion de l'unité légale.

Toutes les unités légales diffusibles ont le statut de diffusion à "O". Les unités légales ayant fait l'objet d'une demande d'opposition ont le statut de diffusion à "P" pour diffusion partielle.
Type

Non-historisé. Liste de codes de longueur 1 :
O : Unité diffusible
P : Unité en diffusion partielle
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


trancheEffectifsUniteLegale

Tranche d'effectif salarié de l'unité légale.

Il s'agit d'une variable statistique, associée à une année de validité. La variable trancheEffectifsUniteLegale est mise à jour une fois par an, avec une validité au 31.12.n-2.
Type

Non-historisé. Liste de codes, de longueur 2.
Format :
NN : Unité non-employeuse ou présumée non-employeuse (faute de déclaration reçue)
00 : 0 salarié (n'ayant pas d'effectif au 31/12 mais ayant employé des salariés au cours de l'année de référence)
01 : 1 ou 2 salariés
02 : 3 à 5 salariés
03 : 6 à 9 salariés
11 : 10 à 19 salariés
12 : 20 à 49 salariés
21 : 50 à 99 salariés
22 : 100 à 199 salariés
31 : 200 à 249 salariés
32 : 250 à 499 salariés
41 : 500 à 999 salariés
42 : 1 000 à 1 999 salariés
51 : 2 000 à 4 999 salariés
52 : 5 000 à 9 999 salariés
53 : 10 000 salariés et plus
null : donnée manquante ou "sans objet"
Exemple

Effectifs à NN : exemple du millésime DSN 2018 (Déclaration Sociale Nominative), injecté en septembre 2020 (effectifs au 31.12.2018).
Suite à l'injection, seront en NN
Les unités qui n’ont jamais été employeuses ;
Les unités qui ne sont plus employeuses depuis 2016 ou avant ;
Les unités employeuses depuis le 1er janvier 2019 ou après (pas encore de DSN utilisée) ;
Les unités ayant une tranche 2017 entre 00 et 53 et absentes de la DSN 2018. Le basculement en NN a lieu début 2021, donc elles gardent la tranche 2017 quelques mois, entre la mise à jour 2018 de septembre 2020 et le début 2021.
En résumé :
Evolution des variables trancheEffectifsEtablissement et anneeEffectifsEtablissement selon le résultat de la mise à jour annuelle des effectifs
* Le cas d’une unité qui passe de NN à 00 est assez rare. En effet, cela indique que l’unité a effectué une première embauche et une fin d’embauche au cours de la même année.


Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


unitePurgeeUniteLegale

Unité légale purgée.

Cette variable indique si l'unité légale a été purgée : pour des raisons de capacité de stockage des données, les données concernant les entreprises cessées avant le 31/12/2002 ont été purgées. La variable n'est affichée en Json que lorsqu'elle vaut true, qu'on interroge les unités légales ou les établissements ; elle est toujours affichée en csv.
Pour ces unités dites purgées :
L'état administratif est : cessé ;
Seules les dernières valeurs des variables de niveau Unité Légale et de niveau Établissement sont conservées ;
En théorie, seul l'établissement siège au moment de la purge est conservé avec uniquement les dernières valeurs de cet établissement. Toutefois, pour plus de 300 unités légales purgées de la base, cette règle n'est pas respectée et ces unités ont toujours plus d'un établissement en base sans pouvoir garantir que tous les établissements ont été conservés ;
L'indicatrice unitePurgeeUniteLegale est à true.
Plus de 4 millions d'unités légales sont purgées. Plus d'une unité purgée sur quatre a une date de création indéterminée.

NB : les établissements des unités purgées sont fermés et n'ont qu'une seule période, avec dateDebut=date de début de l'état fermé si cette date est renseignée, sinon dateDebut (établissement) est à null.
Type

Non-historisé. Liste de codes : true ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	oui	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	non	non	non


Haut de page


dateDebut

Date de début d'une période de l'historique d'une unité légale.

Date de début d'une période, c'est à dire d'un intervalle de temps au cours duquel aucune variable historisée n'est modifiée. La date 1900-01-01 signifie : date non déterminée. dateDebut peut-être vide, uniquement pour les unités légales purgées.
La date de début de la période la plus ancienne ne correspond pas obligatoirement à la date de création de l'entreprise, certaines variables historisées pouvant posséder des dates de début soit au 1900-01-01, soit antérieures à la date de création.
Type

Date, de longueur 10, format AAAA-MM-JJ, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
non	oui	non

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
oui	oui	non	non


Haut de page


dateFin

Date de fin d'une période de l'historique d'une unité légale.

Date de fin d'une période, c'est à dire d'un intervalle de temps au cours duquel aucune variable historisée n'est modifiée.
La date de fin est calculée, elle est égale à la veille de la date de début de la période suivante dans l'ordre chronologique ; si la date de fin de la période est null, la période correspond à la situation courante de l'unité légale.
Type

Date, de longueur 10, format AAAA-MM-JJ, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
non	oui	non

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	oui	non	non


Haut de page


Les variables préfixées "changement"

Chaque variable historisée est accompagnée d'une variable signalant, pour chaque période, si elle a été modifiée (true) ou non (false), c'est à dire si elle est (seule ou avec d'autres variables) à l'origine de la création de la période.
changementActivitePrincipaleUniteLegale
changementCaractereEmployeurUniteLegale
changementCategorieJuridiqueUniteLegale
changementDenominationUniteLegale
changementDenominationUsuelleUniteLegale
changementEconomieSocialeSolidaireUniteLegale
changementEtatAdministratifUniteLegale
changementNicSiegeUniteLegale
changementNomUniteLegale
changementNomUsageUniteLegale
changementSocieteMissionUniteLegale
A l'exception de la première période de l'historique (la plus ancienne), il y a toujours au moins une variable de changement à true à chaque période.
Type

Booléen : true ou false.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
non	oui	non

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	oui	non	non


Haut de page


siret

Numéro siret de l'établissement. Le numéro Siret est le numéro unique d'identification attribué à chaque établissement par l'Insee. Ce numéro est un simple numéro d'ordre, composé de 14 chiffres non significatifs : les neuf premiers correspondent au numéro Siren de l'entreprise dont l'établissement dépend et les cinq derniers à un numéro interne de classement (Nic).
Une entreprise est constituée d'autant d'établissements qu'il y a de lieux différents où elle exerce son activité. L'établissement est fermé quand l'activité cesse dans l'établissement concerné ou lorsque l'établissement change d'adresse.

Type

Non-historisé. Texte numérique de longueur 14.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	oui


Haut de page


activitePrincipaleEtablissement

Activité principale de l'établissement. Lors de son inscription au répertoire, l’Insee attribue à tout établissement un code dit « APET* » sur la base de la description de l’activité principale faite par le déclarant. Ce code est modifiable au cours de la vie de l’établissement en fonction des déclarations de l’exploitant. Pour chaque établissement, il existe à un instant donné un seul code « APET ». Il est attribué selon la nomenclature en vigueur. La nomenclature en vigueur à la date de la mise en place de l’API-Sirene est la Naf Rév.2 et ce depuis le 01 Janvier 2008. Chaque code comporte 4 chiffres et une lettre. Tous les établissements actifs au 01/01/2008 ont eu leur code APE recodé dans la nouvelle nomenclature, ainsi de très nombreux établissements ont une période débutant à cette date.

Les personnes morales ont la possibilité de s'immatriculer sans activité (elles déclarent alors leur commencement d'activité dans un second temps, dans les 12 mois suivant la création) : dans ce cas, l'Insee attribue à l'établissement (unique) le code APET 00.00Z jusqu'à la prise d'activité.

(*) Activité Principale de l'ETablissement.
Historique

Le code APE est historisé depuis le 01/01/2005.

La règle d’historisation des données d’activité est la suivante :
Pour les établissements fermés avant 31/12/2004, seul le dernier code activité connu figure, dans la nomenclature en vigueur à la date de fermeture.
Pour les établissements ouverts après le 01/01/2005 et fermés avant le 31/12/2007, l'historique des codes attribués sur la période est disponible.
Pour les établissements ouverts après le 01/01/2005 et toujours ouverts le 01/01/2008, l'historique intègre le changement de nomenclature.
Pour les établissements ouverts après le 01/01/2008, l'historique comprend les modifications apportées au cours de la vie de l'établissement.
Type

Historisé. Liste de codes de longueur 6.
La variable nomenclatureActivitePrincipaleEtablissement indique à quelle nomenclature d'activité appartient le code.
Lien vers la Nomenclature d'Activités Française.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	oui


Haut de page


activitePrincipaleRegistreMetiersEtablissement

Activité principale de l'établissement au Registre des Métiers. Cette variable, complémentaire à l'activité principale de l'établissement, ne concerne que les établissements relevant de l'artisanat (artisans, artisans-commerçants et sociétés artisanales). Elle caractérise l'activité selon la Nomenclature d'Activités Française de l'Artisanat (NAFA). La variable n'est pas disponible au niveau unité légale.
Type

Non-historisé. Liste de codes, de longueur 6, 4 chiffres et 1 lettre (sans point) correspondant au code APET, suivis d'une lettre spécifique à la NAFA.
Lien vers la Nomenclature d'Activités Française de l'Artisanat au format interactif.
Lien vers la Nomenclature d'Activités Française de l'Artisanat au format pdf.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


anneeEffectifsEtablissement

Année de validité de la tranche d'effectif salarié de l'établissement.

La mise à jour des tranches d'effectifs est annuelle (automne). Les unités mises à jour voient leur année de validité des effectifs actualisée (variable renseignée l'année précédente) ou initialisée (nouveaux employeurs). Les unités non mises à jour gardent leur millésime antérieur. Pour les unités actives qui ne sont pas mises à jour deux années de suite, la variable anneeEffectifsEtablissement renvoie "null". Il n'y a donc jamais plus de deux millésimes différents.
Type

Non-historisé. Date, de longueur 4, format AAAA, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


caractereEmployeurEtablissement

Caractère employeur de l'établissement.

Lors de sa formalité d'ouverture, le déclarant indique si l'établissement aura ou non des salariés au démarrage de l'activité. Par la suite, il peut déclarer alternativement des prises d'emploi (première embauche ou réembauche de salariés) et des fins d'emploi (départ du dernier salarié). Ces déclarations se font auprès de l’URSSAF qui transmet l’information à l’Insee. Les données ne peuvent être corrigées qu’à cette condition. Dès réception, l’Insee, bascule immédiatement l’établissement en « Employeur », en cas de prise d’emploi, ou en « Non employeur » en cas de fin d’emploi. À noter : lors de la fermeture de l'établissement, la variable caractereEmployeurEtablissement n'est pas mise à jour et conserve la dernière valeur connue.
Type

Historisé. Liste de codes, de longueur 1.
Format :
O : établissement employeur
N : établissement non employeur
null : donnée manquante ou "sans objet"
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	oui


Haut de page


codeCedexEtablissement

Code cedex de l'établissement.

Cette variable facultative est un élément constitutif de l'adresse.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


codeCedex2Etablissement

Code cedex de l'adresse secondaire de l'établissement.

Dans le cas où l'établissement dispose d'une entrée secondaire, codeCedex2Etablissement est un élément constitutif de l'adresse secondaire. Cette variable est facultative.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


codeCommuneEtablissement

Code commune de l'établissement.

Cette variable désigne le code géographique de la commune de localisation de l'établissement, hors adresse à l'étranger. Le code commune est celui défini par la Base Adresse Nationale (BAN), au moment du traitement de la formalité la plus récente liée à une modification d’adresse.
Pour les établissements localisés à l'étranger, la variable codeCommuneEtablissement est à null.
Type

Non-historisé. Liste de codes de longueur 5, ou null.
Lien vers le code officiel géographique
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


codeCommune2Etablissement

Code commune de l'adresse secondaire de l'établissement.

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable désigne le code de la commune de l'adresse secondaire de l'établissement, hors adresse à l'étranger.
Type

La variable n'est plus gérée, toujours null.

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


codePaysEtrangerEtablissement

Code pays de l'adresse d'un établissement situé à l'étranger.

Cette variable désigne le code du pays de localisation de l'établissement pour les adresses à l'étranger. La variable codePaysEtrangerEtablissement commence toujours par 99 si elle est renseignée. Les 3 caractères suivants sont le code du pays étranger.
Type

Non-historisé. Liste de codes, longueur 5, ou null.
Lien vers le code officiel géographique
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


codePaysEtranger2Etablissement

Code pays de l'adresse d'un établissement situé à l'étranger.

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable désigne le code du pays de localisation de l'adresse secondaire de l'établissement pour les adresses à l'étranger.
Type

La variable n'est plus gérée, toujours null.

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


codePostalEtablissement

Code postal de l'établissement.

Cette variable désigne le code postal de l'adresse de l'établissement.
Type

Non-historisé. Texte de longueur 9, ou null, ou [ND] si l'unité est en diffusion partielle.

Les codes postaux étrangers sont donnés à titre indicatif. Ils sont de longueur variable et peuvent contenir des lettres ou des blancs.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


codePostal2Etablissement

Code postal de l'adresse secondaire de l'établissement.

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable désigne le code postal de l'adresse secondaire de l'établissement.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


complementAdresseEtablissement

Complément d'adresse de l'établissement.

Cette variable est un élément constitutif de l'adresse.
C'est une variable facultative qui précise l'adresse avec :
une indication d'étage, d'appartement, de porte, de N° de boîte à lettres ;
la désignation d'un bâtiment, d'un escalier, d'une entrée, d'un bloc ;
le nom d'une résidence, d'un ensemble...
Type

Non-historisé. Texte de longueur 100, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


complementAdresse2Etablissement

Complément d'adresse secondaire de l'établissement.

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable est un élément constitutif de l'adresse secondaire.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


dateCreationEtablissement

Date de création de l'établissement.

La date de création correspond à la date qui figure dans la déclaration déposée au CFE compétent. Pour les établissements des unités purgées (unitePurgeeUniteLegale=true) : si la date de création est au 01/01/1900 dans Sirene, la date est forcée à null. Dans tous les autres cas, la date de création n'est jamais à null. Si elle est non renseignée, elle sera au 01/01/1900.
La date de création ne correspond pas obligatoirement à dateDebut de la première période de l'établissement, certaines variables historisées pouvant posséder des dates de début soit au 1900-01-01, soit antérieures à la date de création.
Type

Non-historisé. Date, longueur 10, format AAAA-MM-JJ, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


dateDernierTraitementEtablissement

Date du dernier traitement de l'établissement dans le répertoire Sirene.

Cette date peut concerner des mises à jour de données historisées ou non-historisées, mais aussi de données du répertoire Sirene qui ne sont pas diffusées par API Sirene.
Cette variable peut être à null, pour les unités purgées.
Type

Non-historisé. Date, longueur 23, format AAAA-MM-JJTHH:MM:SS.MMM, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


denominationUsuelleEtablissement

Dénomination usuelle de l'établissement.

Cette variable désigne le nom sous lequel l'établissement est connu du grand public (nom commercial de l'établissement). Cet élément facultatif d'identification de l'établissement a été enregistré au niveau établissement depuis l'application de la norme d'échanges CFE de 2008. Avant la norme 2008, la dénomination usuelle était enregistrée au niveau de l'unité légale sur trois champs (cf. variables denominationUsuelle1UniteLegale à denominationUsuelle3UniteLegale dans le descriptif des variables du fichier StockUniteLegale).
Type

Historisé. Texte de longueur 100, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	oui


Haut de page


distributionSpecialeEtablissement

Distribution spéciale de l'établissement.

La distribution spéciale reprend les éléments particuliers qui accompagnent une adresse de distribution spéciale. C'est un élément constitutif de l'adresse.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.

Exemples :
BP : Boîte postale
TSA : Tri par service à l'arrivée
LP : Local postal
RP : Référence postale
SP : Secteur postal
CP : Case postale
CE : Case entreprise
CS : Course spéciale
POSTE RESTANTE
CIDEX : Courrier individuel à distribution exceptionnelle
CASE, NIVEAU : Mots utilisés pour la distribution interne du courrier à LA DEFENSE
CASIER : Utilisé pour le centre commercial des Quatre Temps
SILIC, SENIA, MAREE, FLEURS : Utilisés sur le site de Rungis

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


distributionSpeciale2Etablissement

Distribution spéciale de l'adresse secondaire de l'établissement.

Dans le cas où l'établissement dispose d'une entrée secondaire, la distribution spéciale reprend les éléments particuliers qui accompagnent l'adresse secondaire de distribution spéciale. C'est un élément constitutif de l'adresse secondaire. Cette variable est facultative.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


enseigne1Etablissement, enseigne2Etablissement, enseigne3Etablissement

Première, deuxième et troisième ligne d'enseigne de l'établissement.

L'enseigne identifie l'emplacement ou le local dans lequel est exercée l'activité. Un établissement peut posséder une enseigne, plusieurs enseignes ou aucune. Les trois variables enseigne1Etablissement, enseigne2Etablissement et enseigne3Etablissement contiennent la ou les enseignes de l'établissement. Si l'enseigne 1 est à null, les deux autres le sont aussi ; si l'enseigne 2 est à null, l'enseigne 3 l'est aussi.
L'analyse des enseignes et de son découpage en trois variables dans Sirene montre deux cas possibles : soit les 3 champs concernent 3 enseignes bien distinctes, soit ces trois champs correspondent au découpage de l'enseigne qui est déclarée dans la liasse (sur un seul champ) avec une continuité des trois champs. Cette variable est facultative.
Type

Historisé. Texte de longueur 50 pour chaque enseigne, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	oui


Haut de page


etablissementSiege

Qualité de siège ou non de l'établissement.

C'est une variable booléenne qui indique si l'établissement est le siège ou non de l'unité légale. Toutes les unités légales, actives comme cessées, ont un et un seul établissement siège. Variable calculée toujours renseignée.
Type

Non-historisé. Booléen : true ou false.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


etatAdministratifEtablissement

Etat administratif de l'établissement.

Lors de son inscription au répertoire, un établissement est, sauf exception, à l'état Actif. Le passage à l'état Fermé découle de la prise en compte d'une déclaration de fermeture. Un établissement fermé peut être rouvert. En règle générale, la première période d'historique d'un établissement correspond à un etatAdministratifUniteLegale égal à Actif. Toutefois, l'état administratif peut être à null (première date de début de l'état postérieure à la première date de début d'une autre variable historisée).
Type

Historisé. Liste de codes, de longueur 1, format :
A : Actif
F : Fermé

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	oui


Haut de page


indiceRepetitionEtablissement

Indice de répétition du numéro dans la voie (B pour Bis, T pour TER, lettres ou chiffres pour identifier différents bâtiments à une même adresse...).

Cette variable facultative est un élément constitutif de l'adresse ; elle est généralement associée à la variable numeroVoieEtablissement.
Type

Non-historisé. Longueur 4. Texte, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


indiceRepetition2Etablissement

Indice de répétition du numéro dans la voie de l'adresse secondaire (B pour Bis, T pour TER, lettres ou chiffres pour identifier différents bâtiments à une même adresse...).

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable facultative est un élément constitutif de l'adresse ; elle est généralement associée à la variable numeroVoie2Etablissement.
Type

Texte de longueur 4. La variable n'est plus gérée. Toujours null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


libelleCedexEtablissement

Libellé associé au code cedex.

Cette variable indique le libellé correspondant au code cedex de l'établissement si celui-ci est non null. Ce libellé est le libellé utilisé dans la ligne 6 d'adresse pour l'acheminement postal.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


libelleCedex2Etablissement

Libellé associé au code cedex de l'adresse secondaire.

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable indique le libellé correspondant au code cedex de l'établissement si celui-ci est non null. Ce libellé est le libellé utilisé dans la ligne 6 d'adresse pour l'acheminement postal.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


libelleCommuneEtablissement

Libellé de la commune.

Cette variable indique le libellé de la commune de localisation de l'établissement si celui-ci n'est pas à l'étranger. C'est un élément constitutif de l'adresse.
Type

Non-historisé. Texte de longueur 100, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


libelleCommune2Etablissement

Libellé de la commune.

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable indique le libellé de la commune de localisation de l'établissement si celui-ci n'est pas à l'étranger. C'est un élément constitutif de l'adresse.
Type

La variable n'est plus gérée, toujours null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


libelleCommuneEtrangerEtablissement

Libellé de la commune pour un établissement situé à l'étranger.

Cette variable est un élément constitutif de l'adresse pour les établissements situés sur le territoire étranger (la variable codeCommuneEtablissement est vide).
Type

Non-historisé. Texte de longueur 100, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


libelleCommuneEtranger2Etablissement

Libellé de la commune pour un établissement situé à l'étranger.

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable est un élément constitutif de l'adresse pour les établissements situés sur le territoire étranger (la variable codeCommuneEtablissement est vide).
Type

La variable n'est plus gérée, toujours null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


libellePaysEtrangerEtablissement

Libellé du pays pour un établissement situé à l'étranger.

Cette variable indique le libellé du pays de localisation de l'établissement si celui-ci est à l'étranger.
Type

Non-historisé. Texte de longueur 100, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


libellePaysEtranger2Etablissement

Libellé du pays pour un établissement situé à l'étranger.

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable indique le libellé du pays de localisation de l'établissement si celui-ci est à l'étranger.
Type

La variable n'est plus gérée, toujours null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


libelleVoieEtablissement

Libellé de la voie.

Cette variable indique le libellé de voie de la commune de localisation de l'établissement. C'est un élément constitutif de l'adresse.
Cette variable est facultative : elle n'est pas toujours renseignée, en particulier dans les petites communes.
Type

Non-historisé. Texte de longueur 100, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


libelleVoie2Etablissement

Libellé de la voie.

Dans le cas où l'établissement dispose d'une entrée secondaire, cette variable indique le libellé de voie de la commune de localisation de l'établissement. C'est un élément constitutif de l'adresse.
Cette variable est facultative : elle n'est pas toujours renseignée, en particulier dans les petites communes.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


nic

Numéro interne de classement de l'établissement.

Le numéro interne de classement permet de distinguer les établissements d'une même entreprise. Il est composé de 5 chiffres. Associé au siren, il forme le siret de l'établissement. Il est composé de quatre chiffres et d'un cinquième qui permet de contrôler la validité du numéro Siret. Le Nic est attribué une seule fois au sein de l'entreprise. Si l'établissement ferme, son nic ne peut être attribué à un autre établissement ; s'il rouvre, le nic est réactivé.
Type

Non-historisé. Texte de longueur 5.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	oui


Haut de page


nombrePeriodesEtablissement

Nombre de périodes de l'établissement.

Cette variable donne le nombre de périodes [dateDebut,dateFin] de l'établissement. Chaque période correspond à l'intervalle de temps pendant lequel aucune des variables historisées de l'établissement n'a été modifiée. Les dates de ces périodes sont des dates d'effet (et non des dates de traitement).
Type

Non-historisé. Numérique de longueur 2.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


nomenclatureActivitePrincipaleEtablissement

Nomenclature d'activité de la variable activitePrincipaleEtablissement.

Cette variable indique la nomenclature d'activité correspondant à la variable activitePrincipaleEtablissement. Tous les établissements actifs ont un code d'activité principale appartenant à la nomenclature la plus récente ; les établissements fermés ont un code appartenant à la nomenclature en vigueur à la date de prise en compte de leur fermeture. La variable nomenclatureActivitePrincipaleEtablissement est à null si la variable activitePrincipaleEtablissement est à null
Type

Historisé. Liste de codes, longueur 8, ou null.
NAFRev2
NAFRev1
NAF1993
NAP

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	oui


Haut de page


numeroVoieEtablissement

Numéro dans la voie.

C'est un élément constitutif de l'adresse. Cette variable est facultative.
Si l'adresse englobe plusieurs numéros dans la voie (5-7, 5 à 7...), l'information complète (5-7) ou (5 à 7) figure en complément d'adresse et le premier des numéros (5 dans l'exemple) est porté dans la variable numeroVoieEtablissement.
Type

Non-historisé. Texte de longueur 9, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


numeroVoie2Etablissement

Numéro dans la voie de l'adresse secondaire.

Dans le cas où l'établissement dispose d'une entrée secondaire, c'est un élément constitutif de l'adresse. Cette variable est facultative.
Si l'adresse secondaire englobe plusieurs numéros dans la voie (5-7, 5 à 7...), l'information complète (5-7) ou (5 à 7) figure en complément d'adresse et le premier des numéros (5 dans l'exemple) est porté dans la variable numeroVoie2Etablissement.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


statutDiffusionEtablissement

Statut de diffusion de l'établissement.

Tous les établissements diffusibles ont le statut de diffusion à "O". Les établissements ayant fait l'objet d'une demande d'opposition ont le statut de diffusion à "P" pour diffusion partielle.
Type

Non-historisé. Liste de codes de longueur 1 :
O : Établissement diffusible
P : Établissement en diffusion partielle

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


trancheEffectifsEtablissement

Tranche d'effectif salarié de l'établissement.

Il s'agit d'une variable statistique, millésimée au 31/12 d'une année donnée (voir variable anneeEffectifsEtablissement)..
Type

Non-historisé. Liste de codes, de longueur 2.
Format :
NN : Etablissement non-employeur ou présumé non-employeur (faute de déclaration reçue) - Voir exemple ci-dessous
00 : 0 salarié (n'ayant pas d'effectif au 31/12 mais ayant employé des salariés au cours de l'année de référence)
01 : 1 ou 2 salariés
02 : 3 à 5 salariés
03 : 6 à 9 salariés
11 : 10 à 19 salariés
12 : 20 à 49 salariés
21 : 50 à 99 salariés
22 : 100 à 199 salariés
31 : 200 à 249 salariés
32 : 250 à 499 salariés
41 : 500 à 999 salariés
42 : 1 000 à 1 999 salariés
51 : 2 000 à 4 999 salariés
52 : 5 000 à 9 999 salariés
53 : 10 000 salariés et plus
null : donnée manquante ou "sans objet"
Avertissement :

La variable trancheEffectifsEtablissement n’a pas de lien direct avec la variable caractereEmployeurEtablissement car les données n’ont ni la même source ni la même temporalité. La variable trancheEffectifsEtablissement est mise à jour une fois par an, avec une validité au 31.12.n-2, alors que la variable caractereEmployeurEtablissement est mise à jour au fur et à mesure des déclarations (création, embauche d'un premier salarié, fin d'emploi du dernier salarié), avec validité immédiate ou légèrement différée.
Exemple

Effectifs à NN : exemple du millésime DSN 2018 (Déclaration Sociale Nominative), injecté en septembre 2020 (effectifs au 31.12.2018).
Suite à l'injection, seront en NN
Les unités qui n’ont jamais été employeuses ;
Les unités qui ne sont plus employeuses depuis 2016 ou avant ;
Les unités employeuses depuis le 1er janvier 2019 ou après (pas encore de DSN utilisée) ;
Les unités ayant une tranche 2017 entre 00 et 53 et absentes de la DSN 2018. Le basculement en NN a lieu début 2021, donc elles gardent la tranche 2017 quelques mois, entre la mise à jour 2018 de septembre 2020 et le début 2021.
En résumé :
Evolution des variables trancheEffectifsEtablissement et anneeEffectifsEtablissement selon le résultat de la mise à jour annuelle des effectifs
* Le cas d’une unité qui passe de NN à 00 est assez rare. En effet, cela indique que l’unité a effectué une première embauche et une fin d’embauche au cours de la même année.


Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


typeVoieEtablissement

Type de voie de l'adresse.

C'est un élément constitutif de l'adresse.
La variable est facultative.
Les abréviations anciennes des données issues du répertoire Sirene 3 cohabitent avec les nouveaux libellés issus de la Base Adresse Nationale.
Type

Non-historisé. Texte de longueur 30, ou null, ou [ND] si l'unité est en diffusion partielle.

Abréviations anciennes issues du répertoire Sirene 3 (non exhaustif) :
ACH : Ancien chemin
AER : Aéroport
AIRE : Aire
ALL : Allée
ART : Ancienne route
AV : Avenue
AVE : Avenue
BASE : Base
BD : Boulevard
BRG : Bourg
CAMI : Cami
CAR : Carrefour
CC : Chemin communal
CD : Chemin départemental
CF : Chemin forestier
CHE : Chemin
CHEM : Cheminement
CHL : Chalet
CHP : Champs
CHS : Chaussée
CHT : Château
CHV : Chemin vicinal
CITE : Cité
CLOS : Clos
COIN : Coin
COR : Corniche
COTE : Cote
COUR : Cour
CR : Chemin rural
CRS : Cours
DOM : Domaine
DSC : Descente
ECA : Ecart
ESP : Esplanade
ESPA : Espace
FBG : Faubourg
FG : Faubourg
FON : Fontaine
FRM : Ferme
GARE : Gare
GPL : Grand-place
GR : Grande Rue
HAB : Habitation
HAM : Hameau
HLE : Halle
HLM : Habitation à loyer modéré
HOT : Hôtel
ILOT : Ilôt
IMP : Impasse
JARD : Jardin
LD : Lieu dit
LDT : Lieu-dit
LOT : Lotissement
MAR : Marché
MTE : Montée
PAE : Parc d’activités économiques
PARC : Parc
PAS : Passage
PL : Place
PLAN : Plan
PLN : Plaine
PLT : Plateau
PONT : Pont
PORT : Port
PRO : Promenade
PROM : Promenade
PRV : Parvis
QRT : Quartier
QUA : Quartier
QUAI : Quai
RD : Route départementale
RES : Résidence
RLE : Ruelle
ROC : Rocade
RPT : Rond Point
RTE : Route
RUE : Rue
SEN : Sente - Sentier
SQ : Square
STDE : Stade
TOUR : Tour
TPL : Terre-plein
TRA : Traverse
VALL : Vallée
VC : Voie communale
VCHE : Vieux chemin
VIL : Ville
VLA : Villa
VLGE : Village
VOIE : Voie
VTE : Vieille route
ZA : Zone artisanale
ZAC : Zone d'aménagement concerté
ZAD : Zone d'aménagement différé
ZI : Zone industrielle
ZONE : Zone
Nouveaux libellés issus de la Base Adresse Nationale (non exhaustif) :
AERODROME
AEROGARE
AGGLOMERATION
ALLEE
ALLEES
ANCIEN CHEMIN
ANCIENNE ROUTE
ANGLE
ARCADE
AUTOROUTE
AVENUE
BARRIERE
BASSIN
BERGE
BOULEVARD
BOURG
BRETELLE
CALL
CALLADA
CALLE
CAMIN
CAMPING
CANAL
CARREFOUR
CARRIERA
CARRIERE
CASERNE
CENTRE
CHALET
CHAMP
CHASSE
CHATEAU
CHAUSSEE
CHEMIN
CHEMIN COMMUNAL
CHEMIN DEPARTEMENTAL
CHEMIN FORESTIER
CHEMIN RURAL
CHEMIN VICINAL
CHEMINEMENT
CONTOUR
CORNICHE
CORON
COULOIR
COURS
COURSIVE
CROIX
DARSE
DESCENTE
DEVIATION
DIGUE
DOMAINE
DRAILLE
ECART
ECLUSE
EMBRANCHEMENT
EMPLACEMENT
ENCLAVE
ENCLOS
ESCALIER
ESPACE
ESPLANADE
ETANG
FAUBOURG
FERME
FOND
FONTAINE
FORET
FOSSE
GALERIE
GRAND BOULEVARD
GRAND PLACE
GRANDE PLACE
GRANDE RUE
GREVE
HABITATION
HALAGE
HALLE
HAMEAU
HAUTEUR
HIPPODROME
IMPASSE
JARDIN
JETEE
LEVEE
LICES
LICES
LIEU DIT
LIGNE
LOTISSEMENT
MAISON
MARCHE
MARINA
MONTEE
MORNE
NOUVELLE ROUTE
PARKING
PARVIS
PASSAGE
PASSE
PASSERELLE
PETIT CHEMIN
PETITE ALLEE
PETITE AVENUE
PETITE ROUTE
PETITE RUE
PHARE
PISTE
PLACA
PLACE
PLACETTE
PLACIS
PLAGE
PLAINE
PLATEAU
POINTE
PORCHE
PORTE
PORTIQUE
POSTE
POTERNE
PROMENADE
QUARTIER
RACCOURCI
RAMPE
RAVINE
REMPART
RESIDENCE
ROCADE
ROND POINT
ROND-POINT
ROTONDE
ROUTE
RUELLE
RUELLETTE
RUET
RUETTE
RUISSEAU
SENTE
SENTIER
SQUARE
STADE
TERRAIN
TERRASSE
TERRE
TERRE-PLEIN
TERTRE
TRABOULE
TRAVERSE
TUNNEL
VALLEE
VALLON
VENELLE
VIADUC
VIEILLE ROUTE
VIEUX CHEMIN
VILLA
VILLAGE
VILLE
VOIE COMMUNALE
VOIRIE
VOUTE
VOYEUL
ZONE ARTISANALE
ZONE DAMENAGEMENT CONCERTE
ZONE DAMENAGEMENT DIFFERE
ZONE INDUSTRIELLE
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
oui	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	non


Haut de page


typeVoie2Etablissement

Type de voie de l'adresse secondaire.

Dans le cas où l'établissement dispose d'une entrée secondaire, c'est un élément constitutif de l'adresse. La variable est facultative.
Type

Texte de longueur 4. La variable n'est plus gérée, toujours null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Jusqu'à Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Jusqu'à Sirene 4	non


Haut de page


coordonneeLambertAbscisseEtablissement

Abscisse des coordonnees Lambert de l'adresse.

Une des deux coordonnées (avec coordonneeLambertOrdonneeEtablissement) permettant la géolocalisation des établissements.
Type

Non-historisé. Texte de longueur 18, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Dès Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Dès Sirene 4	non


Haut de page


coordonneeLambertOrdonneeEtablissement

Ordonnée des coordonnees Lambert de l'adresse.

Une des deux coordonnées (avec coordonneeLambertAbscisseEtablissement) permettant la géolocalisation des établissements.
Type

Non-historisé. Texte de longueur 18, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Dès Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Dès Sirene 4	non


Haut de page


dernierNumeroVoieEtablissement

En cas d'adresse groupée (ex : 11 à 17), dernier numéro du groupe, éventuellement complété par indice de répétition (bis, ter...).
Le premier numéro du groupe est renseigné dans la variable "numeroVoieEtablissement". En cas de numéro unique, la variable dernierNumeroVoieEtablissement est à null.

Type

Non-historisé. Texte de longueur 9, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Dès Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Dès Sirene 4	non


Haut de page


indiceRepetitionDernierNumeroVoieEtablissement

En cas d'adresse groupée (ex : 11A à 11G), indice de répétition du dernier numéro du groupe.
Le premier numéro du groupe est renseigné dans la variable "numeroVoieEtablissement". En cas de numéro unique, la variable indiceRepetitionDernierNumeroVoieEtablissement est à null.

Type

Non-historisé. Longueur 4. Texte, ou null, ou [ND] si l'unité est en diffusion partielle.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Dès Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Dès Sirene 4	non


Haut de page


identifiantAdresseEtablissement

Il s'agit de l'identifiant unique de l'adresse. Il se termine par une lettre identifiant sa source.
Type

Non-historisé. Texte de longueur 15, ou null, ou [ND] si l'unité est en diffusion partielle.
Format

xxxxxxxxx_B : adresse provenant de la Base Adresse Nationale (BAN)
xxxxxxxxx_C : adresse provenant du cadastre

Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
Dès Sirene 4	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	Dès Sirene 4	non


Haut de page


dateDebut

Date de début d'une période de l'historique d'un établissement.

Date de début d'une période, c'est à dire d'un intervalle de temps au cours duquel aucune variable historisée n'est modifiée. La date 1900-01-01 signifie : date non déterminée. dateDebut peut-être vide, uniquement pour les unités légales purgées.
La date de début de la période la plus ancienne ne correspond pas obligatoirement à la date de création de l'établissement, certaines variables historisées pouvant posséder des dates de début soit au 1900-01-01, soit antérieures à la date d'ouverture.
Type

Date, de longueur 10, format AAAA-MM-JJ, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
non	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	oui	oui


Haut de page


dateFin

Date de fin d'une période de l'historique d'un établissement.

Date de fin d'une période, c'est à dire d'un intervalle de temps au cours duquel aucune variable historisée n'est modifiée.
La date de fin est calculée, elle est égale à la veille de la date de début de la période suivante dans l'ordre chronologique ; si la date de fin de la période est null, la période correspond à la situation courante de l'établissement.
Type

Date, de longueur 10, format AAAA-MM-JJ, ou null.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
non	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	non	oui


Haut de page


Les variables préfixées "changement"

Chaque variable historisée est accompagnée d'une variable signalant, pour chaque période, si elle a été modifiée (true) ou non (false), c'est à dire si elle est (seule ou avec d'autres variables) à l'origine de la création de la période.
changementActivitePrincipaleEtablissement
changementCaractereEmployeurEtablissement
changementDenominationUsuelleEtablissement
changementEnseigneEtablissement
changementEtatAdministratifEtablissement
A l'exception de la première période de l'historique (la plus ancienne), il y a toujours au moins une variable de changement à true à chaque période.
Type

Booléen : true ou false.
Présence de la variable selon le dessin de fichier

Liste constituée sur sirene.fr	API Sirene 3.11-collection Unités Légales	API Sirene 3.11-collection Établissements
non	non	oui

Fichier StockUniteLegale	Fichier StockUniteLegaleHistorique	Fichier StockEtablissement	Fichier StockEtablissementHistorique
non	non	non	oui


Haut de page


siretEtablissementPredecesseur

Numéro siret de l'établissement prédécesseur.

Cette variable désigne le numéro siret de l'établissement prédécesseur.
Type

Numérique de longueur 14.
Présence de la variable selon le dessin de fichier

Variable présente uniquement dans le service Liens de succession de l'API Sirene et dans le fichier stockEtablissementLiensSuccession

Haut de page


siretEtablissementSuccesseur

Numéro siret de l'établissement successeur.

Cette variable désigne le numéro siret de l'établissement successeur.
Type

Numérique de longueur 14.
Présence de la variable selon le dessin de fichier

Variable présente uniquement dans le service Liens de succession de l'API Sirene et dans le fichier stockEtablissementLiensSuccession

Haut de page


dateLienSuccession

Date d'effet du lien de succession.

Cette variable indique la date à laquelle la succession a lieu.
Type

Date de longueur 10, format AAAA-MM-JJ.
Présence de la variable selon le dessin de fichier

Variable présente uniquement dans le service Liens de succession de l'API Sirene et dans le fichier stockEtablissementLiensSuccession

Haut de page


transfertSiege

Indicatrice de transfert de siège.

C'est une variable qui indique si le lien de succession est accompagné d'un transfert de siège. Il peut s'agir d'un transfert de l'établissement ayant la qualité de siège, ou d'un transfert de la qualité de siège d'un établissement à un autre. La variable prend la valeur true si le lien de succession concerne l'établissement siège, false si seulement des établissements secondaires sont concernés.
Type

Booléen : true ou false.
Présence de la variable selon le dessin de fichier

Variable présente uniquement dans le service Liens de succession de l'API Sirene et dans le fichier stockEtablissementLiensSuccession

Haut de page


continuiteEconomique

Indicatrice de continuité économique entre les deux établissements.

C'est une variable qui indique s'il y a continuité économique entre les deux établissements qui se succèdent.
Notion de continuité économique : il y a continuité économique entre deux établissements qui se succèdent dès lors que deux des trois critères suivants sont vérifiés :
les deux établissements appartiennent à la même unité légale (même Siren) ;
les deux établissements exercent la même activité (même code APE) ;
les deux établissements sont situés dans un même lieu (numéro et libellé de voie, code commune).
À noter : en cas de transfert de siège, la variable continuiteEconomique est toujours à true.
Type

Booléen :
true : il y a continuité économique
false : il n'y a pas continuité économique
Présence de la variable selon le dessin de fichier

Variable présente uniquement dans le service Liens de succession de l'API Sirene et dans le fichier stockEtablissementLiensSuccession

Haut de page


dateDernierTraitementLienSuccession

Date de traitement du lien de succession.

Cette variable indique la date à laquelle le lien de succession a été enregistré dans le répertoire Sirene.
Type

Date de longueur 23, format Format "AAAA-MM-JJTHH:MM:SS.MMM" ou AAAA-MM-JJTHH\:MM\:SS.MMM.
Présence de la variable selon le dessin de fichier

Variable présente uniquement dans le service Liens de succession de l'API Sirene et dans le fichier stockEtablissementLiensSuccession
