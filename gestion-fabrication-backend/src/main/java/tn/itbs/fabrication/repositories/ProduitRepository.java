package tn.itbs.fabrication.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.itbs.fabrication.entities.Produit;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
	
	// Rechercher par nom
    List<Produit> findByNom(String nom);

    // Produits avec stock faible
    List<Produit> findByStockLessThan(int stock);
}
