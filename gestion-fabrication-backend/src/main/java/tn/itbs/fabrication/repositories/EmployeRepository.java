package tn.itbs.fabrication.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.itbs.fabrication.entities.Employe;

public interface EmployeRepository extends JpaRepository<Employe, Long> {
	// Employés par poste
    List<Employe> findByPoste(String poste);

    // Employés assignés à une machine
    List<Employe> findByMachineId(Long machineId);


}
