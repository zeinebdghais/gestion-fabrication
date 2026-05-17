package tn.itbs.fabrication.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.itbs.fabrication.entities.Produit;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Integer> {
	
	List<Produit> findByNom(String nom);

    List<Produit> findByType(String type);

    List<Produit> findByStockLessThan(int quantite);
}
