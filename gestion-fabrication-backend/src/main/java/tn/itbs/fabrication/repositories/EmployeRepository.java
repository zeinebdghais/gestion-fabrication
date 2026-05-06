package tn.itbs.fabrication.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.itbs.fabrication.entities.Employe;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Integer> {
	List<Employe> findByPoste(String poste);

    List<Employe> findByMachineAssigneeId(Long machineId);

    List<Employe> findByMachineAssigneeIsNull();

    List<Employe> findByNom(String nom);

}
