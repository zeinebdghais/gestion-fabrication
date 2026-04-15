package tn.itbs.fabrication.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.itbs.fabrication.entities.Machine;

public interface MachineRepository extends JpaRepository<Machine, Long> {

}
