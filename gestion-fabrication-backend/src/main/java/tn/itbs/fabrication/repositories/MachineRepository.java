package tn.itbs.fabrication.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.itbs.fabrication.entities.Machine;

public interface MachineRepository extends JpaRepository<Machine, Long> {
	// Machines par état
    List<Machine> findByEtat(String etat);

    // Machines à maintenir (ancienne maintenance)
    List<Machine> findByDerniereMaintenanceBefore(LocalDate date);

}
