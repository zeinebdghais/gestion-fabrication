# FabriManager — Frontend Angular

Interface Angular 18 pour la gestion des ordres de fabrication.

## 🏗️ Structure du projet

```
src/app/
├── core/
│   ├── models/
│   │   └── models.ts                     # Tous les DTOs (Produit, Machine, Employe, OrdreFabrication)
│   └── services/
│       ├── produit.service.ts            # CRUD Produit
│       ├── machine.service.ts            # CRUD Machine + maintenance
│       ├── employe.service.ts            # CRUD Employé + assignation
│       ├── ordre-fabrication.service.ts  # CRUD Ordre + workflow (démarrer/terminer/annuler)
│       └── notification.service.ts       # Toast notifications
├── shared/
│   └── components/
│       ├── modal/                        # Composant modal réutilisable
│       └── notifications/               # Toast notifications
└── features/
    ├── dashboard/                        # Tableau de bord avec stats
    ├── produits/                         # Gestion produits (CRUD + recherche)
    ├── machines/                         # Gestion machines (CRUD + filtres + maintenance)
    ├── employes/                         # Gestion employés (CRUD + affectation machine)
    └── ordres-fabrication/              # Gestion ordres (CRUD + workflow complet)
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- Angular CLI 18+

### Installation
```bash
npm install
```

### Démarrage (avec proxy vers backend Spring Boot)
```bash
# Assurez-vous que votre backend tourne sur http://localhost:8080
npm start
# ou: ng serve --proxy-config proxy.conf.json
```

L'application sera disponible sur **http://localhost:4200**

### Build production
```bash
npm run build
```

## 🔗 Configuration API

Le backend est configuré dans `src/environments/environment.ts` :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'   // ← Changez ici si nécessaire
};
```

## ✨ Fonctionnalités

### Tableau de Bord
- Vue globale : nombre d'ordres par état, état des machines
- Accès rapide aux modules
- Indicateurs en temps réel

### Produits (`/produits`)
- Liste complète avec recherche par ID ou nom
- CRUD complet via modale
- Indicateur stock faible (< 10)

### Machines (`/machines`)
- Affichage en cartes avec code couleur par état
- Filtres : Disponible / En Marche / En Maintenance / Hors Service
- Déclencher maintenance en un clic
- CRUD complet

### Employés (`/employes`)
- Table avec avatars initiales
- Affectation de machine via modale dédiée
- CRUD complet

### Ordres de Fabrication (`/ordres`)
- Table complète avec onglets filtrants par état
- **Workflow complet** :
  - `EN_ATTENTE` → **Démarrer** → `EN_COURS`
  - `EN_COURS` → **Terminer** → `TERMINE`
  - `EN_ATTENTE` / `EN_COURS` → **Annuler** → `ANNULE`
- Assignation de machine à un ordre
- CRUD complet

## 🎨 Design

- Thème sombre industriel (dark blue/cyan)
- Typographie : IBM Plex Mono + IBM Plex Sans
- Animations fluides et micro-interactions
- Notifications toast pour toutes les actions
- Interface responsive

## ⚙️ CORS Backend

Pour que le frontend Angular puisse communiquer avec le backend Spring Boot, ajoutez cette configuration CORS dans votre backend :

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```
