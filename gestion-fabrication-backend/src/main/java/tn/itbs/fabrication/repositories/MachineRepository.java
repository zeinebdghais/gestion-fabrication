package tn.itbs.fabrication.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.itbs.fabrication.entities.Machine;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Integer> {
	
	List<Machine> findByEtat(String etat);

    List<Machine> findByNom(String nom);


}
