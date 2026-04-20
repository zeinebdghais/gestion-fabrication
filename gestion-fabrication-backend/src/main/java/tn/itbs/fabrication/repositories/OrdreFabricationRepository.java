package tn.itbs.fabrication.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.itbs.fabrication.entities.OrdreFabrication;

public interface OrdreFabricationRepository extends JpaRepository<OrdreFabrication, Long> {
	// Trouver par état
    List<OrdreFabrication> findByEtat(String etat);

    // Trouver par produit
    List<OrdreFabrication> findByProduitId(Long produitId);

    // Trouver par machine
    List<OrdreFabrication> findByMachineId(Long machineId);

}
