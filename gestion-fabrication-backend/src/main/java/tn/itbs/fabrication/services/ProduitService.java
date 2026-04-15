package tn.itbs.fabrication.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.itbs.fabrication.entities.Produit;
import tn.itbs.fabrication.repositories.ProduitRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProduitService {

    private final ProduitRepository produitRepository;

    public List<Produit> getAll() {
        return produitRepository.findAll();
    }

    public Produit getById(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
    }

    public Produit create(Produit produit) {
        return produitRepository.save(produit);
    }

    public Produit update(Long id, Produit produit) {
        Produit existing = getById(id);

        existing.setNom(produit.getNom());
        existing.setType(produit.getType());
        existing.setStock(produit.getStock());
        existing.setFournisseur(produit.getFournisseur());

        return produitRepository.save(existing);
    }

    public void delete(Long id) {
        produitRepository.deleteById(id);
    }
}