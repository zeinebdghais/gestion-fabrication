package tn.itbs.fabrication.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.itbs.fabrication.entities.OrdreFabrication;

@Repository
public interface OrdreFabricationRepository extends JpaRepository<OrdreFabrication, Integer> {
	List<OrdreFabrication> findByEtat(String etat);

    List<OrdreFabrication> findByProduitId(int produitId);

    List<OrdreFabrication> findByMachineId(int machineId);

    List<OrdreFabrication> findByDateBetween(LocalDate debut, LocalDate fin);

    List<OrdreFabrication> findByProjet(String projet);

    List<OrdreFabrication> findByMachineIdAndEtat(int machineId, String etat);
}
