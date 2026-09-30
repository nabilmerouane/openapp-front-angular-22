# Checkpoint --- Formation Angular 22 + Java 17 / Spring

## 1. Objectif de la formation

Objectif : faire évoluer progressivement une application Angular 22 +
Java 17 / Spring Boot d'un CRUD pédagogique vers une application
suffisamment réaliste pour travailler des compétences de niveau
senior/expert.

Méthode souhaitée : - travailler sur un seul projet qui devient
progressivement plus complexe ; - comprendre les choix d'architecture
plutôt que copier du code ; - faire des revues de code et des questions
de raisonnement ; - traiter les problèmes comme dans une revue de code
ou un entretien senior ; - chaque nouvelle notion doit être reliée au
projet réel ; - éviter d'ajouter de la complexité inutilement.

Important : dans une nouvelle conversation, commencer par lire ce
fichier avant de proposer une nouvelle étape.

---

# 2. Stack actuelle

## Frontend

- Angular 22
- TypeScript
- composants standalone
- `ChangeDetectionStrategy.OnPush`
- Signals
- Angular Forms / `formField`
- `HttpClient`
- routing Angular
- resolver Angular

## Backend

- Java 17
- Spring Boot
- Spring Web / REST
- Spring Data JPA
- `JpaRepository`
- DTO Java records
- architecture Controller -\> Service -\> Repository

---

# 3. Architecture actuelle

## Angular

```text
src/app/
├── demo-personnes/
│   ├── personne-component/
│   │   ├── personne-component.html
│   │   ├── personne-component.spec.ts
│   │   └── personne-component.ts
│   ├── personne-form/
│   │   ├── personne-form.component.html
│   │   ├── personne-form.component.spec.ts
│   │   └── personne-form.component.ts
│   └── personnes-liste/
├── home/
├── models/
│   ├── create-personne-request.ts
│   ├── personne-response.ts
│   ├── personne.ts
│   └── update-personne-request.ts
├── services/
│   ├── personne-resolver.ts
│   ├── personne-resolver.spec.ts
│   ├── personne-service.ts
│   └── personne-service.spec.ts
├── signals-demo/
├── app.config.ts
├── app.routes.ts
├── app.html
├── app.scss
├── app.spec.ts
└── app.ts
```

## Backend

```text
src/main/java/com/example/demojava17spring/
├── controller/
│   └── PersonneController.java
├── dto/
│   ├── CreatePersonneRequest.java
│   ├── PersonneResponse.java
│   └── UpdatePersonneRequest.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── PersonneNotFoundException.java
├── model/
│   └── Personne.java
├── repository/
│   └── PersonneRepository.java
├── service/
│   └── PersonneService.java
└── DemoJava17SpringApplication.java
```

Note : le package `com.example.demo` (vide) existe encore à côté de
`demojava17spring`. À supprimer s'il ne sert à rien.

---

# 4. Backend actuel

## PersonneController

```java
@RestController
@RequestMapping("/api/personnes")
public class PersonneController {

  private final PersonneService personneService;

  public PersonneController(PersonneService personneService) {
    this.personneService = personneService;
  }

  @GetMapping
  public List<PersonneResponse> getPersonnes() {
    return personneService.getPersonnes();
  }

  @GetMapping("/{id}")
  public PersonneResponse getPersonne(@PathVariable Long id) {
    return personneService.getPersonne(id);
  }

  @PostMapping
  public PersonneResponse addPersonne(@Valid @RequestBody CreatePersonneRequest request) {
    return personneService.addPersonne(request);
  }

  @PutMapping("/{id}")
  public PersonneResponse updatePersonne(
      @PathVariable Long id, @Valid @RequestBody UpdatePersonneRequest request) {
    return personneService.updatePersonne(id, request);
  }
}
```

## PersonneService

```java
@Service
public class PersonneService {

  private final PersonneRepository personneRepository;

  public PersonneService(PersonneRepository personneRepository) {
    this.personneRepository = personneRepository;
  }

  public List<PersonneResponse> getPersonnes() {
    return personneRepository.findAll().stream()
        .map(
            personne ->
                new PersonneResponse(personne.getId(), personne.getPrenom(), personne.getNom()))
        .toList();
  }

  public PersonneResponse getPersonne(Long personneId) {
    Personne personne =
        personneRepository
            .findById(personneId)
            .orElseThrow(() -> new PersonneNotFoundException(personneId));

    return new PersonneResponse(personne.getId(), personne.getPrenom(), personne.getNom());
  }

  public PersonneResponse addPersonne(CreatePersonneRequest request) {
    Personne personne = new Personne(null, request.nom(), request.prenom());

    Personne savedPersonne = personneRepository.save(personne);

    return new PersonneResponse(
        savedPersonne.getId(), savedPersonne.getPrenom(), savedPersonne.getNom());
  }

  public PersonneResponse updatePersonne(Long id, UpdatePersonneRequest request) {
    Personne personne =
        personneRepository.findById(id).orElseThrow(() -> new PersonneNotFoundException(id));

    personne.modifier(request.nom(), request.prenom());

    Personne updatedPersonne = personneRepository.save(personne);

    return new PersonneResponse(
        updatedPersonne.getId(), updatedPersonne.getPrenom(), updatedPersonne.getNom());
  }
}
```

## Repository

```java
public interface PersonneRepository extends JpaRepository<Personne, Long> {}
```

## DTOs

Package `dto`. La validation est portée par `@NotBlank` (dépendance
`spring-boot-starter-validation` dans le `pom.xml`) et déclenchée par
`@Valid` dans le contrôleur. L'ordre des champs (`nom`, `prenom`) est
aligné dans les deux records de requête.

```java
public record CreatePersonneRequest(@NotBlank String nom, @NotBlank String prenom) {}
```

```java
public record UpdatePersonneRequest(@NotBlank String nom, @NotBlank String prenom) {}
```

```java
public record PersonneResponse(Long id, String prenom, String nom) {}
```

## Exceptions et gestion globale des erreurs

Package `exception` (neutre : `controller` et `service` en dépendent
sans se croiser).

```java
public class PersonneNotFoundException extends RuntimeException {

  public PersonneNotFoundException(Long id) {
    super("Personne non trouvée avec l'id : " + id);
  }
}
```

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PersonneNotFoundException.class)
    public ProblemDetail handlePersonneNotFound(PersonneNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Personne introuvable");
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "La requête contient des champs invalides");
        problem.setTitle("Erreur de validation");

        Map<String, List<String>> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.groupingBy(
                        FieldError::getField,
                        Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())));

        problem.setProperty("errors", errors);
        return problem;
    }
}
```

Exemple de réponse 400 (nom et prénom vides) :

```json
{
  "type": "about:blank",
  "title": "Erreur de validation",
  "status": 400,
  "detail": "La requête contient des champs invalides",
  "instance": "/api/personnes",
  "errors": {
    "nom": ["must not be blank"],
    "prenom": ["must not be blank"]
  }
}
```

---

# 5. Angular actuel

## PersonneService

```typescript
@Injectable({
  providedIn: 'root',
})
export class PersonneService {
  private readonly http = inject(HttpClient);

  getPersonnes(): Observable<PersonneResponse[]> {
    return this.http.get<PersonneResponse[]>('/api/personnes');
  }

  getPersonne(id: number): Observable<PersonneResponse> {
    return this.http.get<PersonneResponse>(`/api/personnes/${id}`);
  }

  addPersonne(request: CreatePersonneRequest): Observable<PersonneResponse> {
    return this.http.post<PersonneResponse>('/api/personnes', request);
  }

  updatePersonne(id: number, request: UpdatePersonneRequest): Observable<PersonneResponse> {
    return this.http.put<PersonneResponse>(`/api/personnes/${id}`, request);
  }
}
```

## PersonneComponent

```typescript
@Component({
  selector: 'app-personne-component',
  imports: [],
  templateUrl: './personne-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonneComponent {
  private readonly route = inject(ActivatedRoute);

  readonly personne = this.route.snapshot.data['personne'] as Personne;
}
```

## PersonneFormComponent

```typescript
@Component({
  selector: 'app-personne-form',
  templateUrl: './personne-form.component.html',
  imports: [FormField],
})
export class PersonneFormComponent {
  private readonly personneService = inject(PersonneService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly personne = this.route.snapshot.data['personne'] as Personne | undefined;

  readonly createPersonne = signal<CreatePersonneRequest>({
    nom: this.personne?.nom ?? '',
    prenom: this.personne?.prenom ?? '',
  });

  readonly personneForm = form(this.createPersonne, (schema) => {
    required(schema.nom);
    required(schema.prenom);
  });

  submit(event: SubmitEvent): void {
    event.preventDefault();

    if (this.personneForm().invalid()) {
      return;
    }

    if (this.personne) {
      this.personneService
        .updatePersonne(this.personne.id, this.createPersonne())
        .subscribe((personne) => {
          this.router.navigate(['/personnes', personne.id]);
        });

      return;
    }

    this.personneService.addPersonne(this.createPersonne()).subscribe((personne) => {
      this.router.navigate(['/personnes', personne.id]);
    });
  }
}
```

## PersonneComponent HTML

```html
<p>ID : {{ personne.id }}</p>
<p>Nom : {{ personne.nom }}</p>
<p>Prénom : {{ personne.prenom }}</p>
```

## PersonneFormComponent HTML

```html
<h1>{{ personne ? 'Modifier la personne' : 'Nouvelle personne' }}</h1>

<form (submit)="submit($event)">
  <div>
    <label for="prenom">Prénom</label>
    <input id="prenom" type="text" [formField]="personneForm.prenom" />
  </div>

  <div>
    <label for="nom">Nom</label>
    <input id="nom" type="text" [formField]="personneForm.nom" />
  </div>

  <button type="submit">{{ personne ? 'Enregistrer' : 'Ajouter' }}</button>
</form>
```

## Interfaces

```typescript
export interface Personne {
  id: number;
  nom: string;
  prenom: string;
}
```

```typescript
export interface CreatePersonneRequest {
  nom: string;
  prenom: string;
}
```

```typescript
export interface PersonneResponse {
  id: number;
  prenom: string;
  nom: string;
}
```

Note : `UpdatePersonneRequest` existe dans le projet mais son contenu
n'a pas été fourni dans le dernier checkpoint. Le récupérer du projet
réel avant toute modification.

---

# 6. Ce qui est déjà en place

Le projet possède déjà plusieurs bonnes bases :

- séparation Controller / Service / Repository ;
- DTOs distincts de l'entité ;
- `record` Java pour les DTOs ;
- exception métier `PersonneNotFoundException` ;
- validation backend des DTOs de création et de modification
  (`@NotBlank` + `@Valid`) ;
- gestion globale des erreurs (`@RestControllerAdvice`, `ProblemDetail`) :
  404 pour une personne introuvable, 400 avec erreurs par champ pour
  une requête invalide ;
- packages `dto` et `exception` dédiés, `model` réservé à l'entité ;
- repository Spring Data ;
- Angular standalone ;
- injection moderne avec `inject()` ;
- `ChangeDetectionStrategy.OnPush` sur le composant détail ;
- Signals utilisés dans le formulaire ;
- validation côté formulaire Angular ;
- resolver Angular ;
- tests présents côté Angular et backend.

## Décisions d'architecture prises (étape 1)

- Le `GlobalExceptionHandler` et les exceptions métier vivent dans un
  package `exception` neutre, plutôt que dans `controller` et
  `service` (évite qu'un contrôleur dépende d'un détail du service).
- Les DTOs sont séparés de l'entité dans un package `dto`.
- Le 400 renvoie un `detail` fixe et un titre générique : on
  n'expose jamais `ex.getMessage()` (contenu technique interne).
- Les erreurs de validation sont regroupées avec `groupingBy` dans une
  `Map<String, List<String>>` : pas d'exception si un même champ viole
  plusieurs contraintes, et le front peut afficher les messages sous
  le bon champ.
- `ResponseEntityExceptionHandler` écarté pour l'instant :
  une méthode `@ExceptionHandler` supplémentaire suffit.

---

# 7. Points à examiner dans la prochaine session

La prochaine étape prévue est :

## Étape 1 --- rendre l'API REST professionnelle (en cours)

Ne pas commencer par ajouter une nouvelle fonctionnalité métier.

### Avancement

Fait :

- validation backend : `@NotBlank` + `@Valid` (POST et PUT) ;
- `spring-boot-starter-validation` ajouté au `pom.xml` ;
- refactorisation en packages `dto` et `exception` ;
- `GlobalExceptionHandler` : 404 (`PersonneNotFoundException`) et
  400 (`MethodArgumentNotValidException`) au format `ProblemDetail`.

Reste à faire :

- contrat d'API, mapping DTO, tests backend ;
- optionnel : `@Size`, messages de validation en français
  (`@NotBlank(message = "...")`, ceux par défaut sont en anglais),
  `ResponseEntityExceptionHandler` pour les autres erreurs Spring
  (JSON malformé, type de paramètre invalide) ;
- côté Angular : exploiter la propriété `errors` du 400 (voir plus bas).

Ordre de travail restant :

### Backend

1.  Validation des DTOs (**fait** pour `@Valid` et `@NotBlank`) :
    - éventuellement `@Size`
    - différences entre validation création / modification
2.  Gestion globale des erreurs (**fait** pour 404 et 400) :
    - autres erreurs pertinentes (JSON malformé, paramètre invalide,
      erreur 500 générique)
3.  Contrat d'API :
    - codes HTTP
    - structure des réponses
    - cohérence des DTOs
    - éventuellement `Location` après création
    - réflexion sur PUT vs PATCH
4.  Mapping DTO :
    - éviter la duplication si cela devient pertinent
    - décider où placer le mapping
    - ne pas introduire une bibliothèque inutilement
5.  Tests :
    - tests unitaires du service
    - tests du contrôleur
    - cas nominal
    - personne inexistante
    - requête invalide (vérifier le 400 et le format de `errors`)

### Angular

1.  Gestion des erreurs HTTP (le backend renvoie désormais un 400 avec
    `error.error.errors.<champ>` : liste de messages par champ).
2.  Typage des DTOs.
3.  Gestion du loading.
4.  Gestion de l'état d'erreur.
5.  Éviter les `subscribe()` naïfs si une meilleure architecture est
    pertinente.
6.  Vérifier l'utilisation du resolver.
7.  Tester les scénarios réels plutôt que seulement `toBeTruthy()`.

---

# 8. Méthode pédagogique souhaitée

Pour chaque étape :

1.  Faire une revue de l'existant.
2.  Expliquer le problème.
3.  Expliquer pourquoi le problème est important à un niveau senior.
4.  Poser éventuellement une petite question de raisonnement.
5.  Proposer une solution.
6.  Modifier le code progressivement.
7.  Expliquer les alternatives.
8.  Ajouter ou adapter les tests.
9.  Faire une mini revue finale.
10. Mettre à jour ce checkpoint.

Ne pas simplement donner toute la solution d'un coup lorsque le sujet se
prête à un apprentissage interactif.

---

# 9. Roadmap globale

## Niveau 1 --- API professionnelle

- DTO
- validation
- erreurs
- HTTP semantics
- tests

## Niveau 2 --- Persistance réelle

- PostgreSQL
- JPA/Hibernate
- transactions
- migrations Flyway
- contraintes SQL
- index
- N+1

## Niveau 3 --- API métier plus réaliste

- pagination
- tri
- recherche
- filtres
- spécifications
- concurrence / optimistic locking

## Niveau 4 --- Angular avancé

- Signals
- RxJS
- état local vs état serveur
- gestion des erreurs
- loading
- cache
- routing
- composants réutilisables
- performance

## Niveau 5 --- Tests

- unitaires
- intégration
- tests HTTP
- Testcontainers
- tests Angular réalistes

## Niveau 6 --- Sécurité

- Spring Security
- authentification
- JWT
- rôles
- autorisations
- Angular guards/interceptors

## Niveau 7 --- Production

- Docker
- CI/CD
- Actuator
- logs
- métriques
- observabilité
- configuration
- profils

## Niveau 8 --- Architecture

- architecture hexagonale
- clean architecture
- DDD léger
- ports/adapters
- événements
- messaging

## Niveau 9 --- Expertise

- performance
- concurrence
- cache
- résilience
- idempotence
- retry
- circuit breaker
- architecture distribuée
- décisions d'architecture et trade-offs

---

# 10. Règle importante pour les futures conversations

Ne pas supposer que la conversation précédente est disponible.

Le fichier de checkpoint est la source de continuité pédagogique.

Dans une nouvelle conversation :

1.  uploader `FORMATION-CHECKPOINT.md`;
2.  uploader uniquement les fichiers de code nécessaires à l'étape
    courante ;
3.  utiliser le prompt ci-dessous.

---

# 11. Prompt de reprise

```text
Je continue ma formation Angular 22 + Java 17 / Spring vers un niveau senior/expert.

Voici mon checkpoint de formation.
Lis-le entièrement avant de répondre.

Je veux continuer exactement à partir de l'état décrit dans ce fichier.

Méthode :
- travaille sur mon vrai projet ;
- ne saute pas directement à une solution complète ;
- explique les choix d'architecture ;
- raisonne comme lors d'une code review senior ;
- challenge mes choix quand c'est pertinent ;
- privilégie la compréhension aux copier-coller ;
- conserve les bonnes pratiques déjà en place ;
- ne réécris pas l'architecture sans raison ;
- quand du code est nécessaire, indique précisément quel fichier modifier ;
- à la fin de chaque étape, indique ce qui a été appris et ce qui reste à faire.

Étape courante indiquée par le checkpoint :
Étape 1 — API REST professionnelle : la validation (@NotBlank/@Valid) et la gestion globale des erreurs (404 et 400 avec ProblemDetail) sont faites. Reste : contrat d'API, mapping DTO, tests, puis gestion des erreurs HTTP côté Angular.

Commence par une revue de l'état actuel et identifie le premier changement à faire.
```

---

# 12. Git : recommandé

Le checkpoint doit être accompagné du dépôt Git.

Créer idéalement un commit à chaque étape importante :

```text
formation/01-crud-initial
formation/02-api-validation-errors
formation/03-postgresql-jpa
formation/04-pagination-search
formation/05-angular-state
...
```

Avant de commencer une nouvelle grosse étape :

```bash
git status
git add .
git commit -m "formation: étape X ..."
```

Cela permet de revenir en arrière et de comparer les évolutions.

---

# 13. Principe de continuité

La conversation n'est pas la mémoire principale de la formation.

La mémoire principale doit être :

```text
Git
 +
FORMATION-CHECKPOINT.md
 +
code réel du projet
```

La conversation sert principalement à travailler sur l'étape en cours.

À la fin d'une session importante, demander :

> Mets à jour mon checkpoint de formation avec l'état actuel, les
> notions acquises, les décisions d'architecture, les points restant à
> travailler et la prochaine étape.

Puis remplacer le fichier du projet par la nouvelle version.
