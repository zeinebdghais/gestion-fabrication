package tn.itbs.fabrication.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.itbs.fabrication.entities.Produit;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
}
