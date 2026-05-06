package tn.itbs.fabrication.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import tn.itbs.fabrication.entities.Produit;
import tn.itbs.fabrication.repositories.ProduitRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {

	@Autowired
    private ProduitRepository produitRepo;

    public List<Produit> trouverTousLesProduits() {
        return produitRepo.findAll();
    }

    public Optional<Produit> trouverProduitParId(int id) {
        return produitRepo.findById(id);
    }

    public List<Produit> trouverProduitParNom(String nom) {
        return produitRepo.findByNom(nom);
    }

    public void ajouterProduit(Produit produit) {
        produitRepo.save(produit);
    }

    public ResponseEntity<String> supprimerProduit(int id) {
        produitRepo.findById(id).ifPresentOrElse(
            p -> {
                produitRepo.deleteById(id);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Produit non trouvé");
            }
        );
        return ResponseEntity.ok("Suppression avec succès");
    }

    public ResponseEntity<String> mettreAJourProduit(int id, Produit prod) {
        produitRepo.findById(id).ifPresentOrElse(
            p -> {
                p.setNom(prod.getNom());
                p.setType(prod.getType());
                p.setStock(prod.getStock());
                p.setFournisseur(prod.getFournisseur());
                produitRepo.save(p);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Produit non trouvé");
            }
        );
        return ResponseEntity.ok("Mise à jour avec succès");
    }
}