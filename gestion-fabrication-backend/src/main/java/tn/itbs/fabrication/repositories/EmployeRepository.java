package tn.itbs.fabrication.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.itbs.fabrication.entities.Employe;

public interface EmployeRepository extends JpaRepository<Employe, Long> {

}
