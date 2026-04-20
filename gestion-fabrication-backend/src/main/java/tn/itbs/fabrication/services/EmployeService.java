package tn.itbs.fabrication.services;

import org.springframework.stereotype.Service;
import tn.itbs.fabrication.entities.Employe;
import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.repositories.EmployeRepository;
import tn.itbs.fabrication.repositories.MachineRepository;

import java.util.List;

@Service
public class EmployeService {

	private final EmployeRepository employeRepo;
    private final MachineRepository machineRepo;

    public EmployeService(EmployeRepository employeRepo, MachineRepository machineRepo) {
        this.employeRepo = employeRepo;
        this.machineRepo = machineRepo;
    }

    public Employe save(Employe employe) {
        return employeRepo.save(employe);
    }

    public List<Employe> getAll() {
        return employeRepo.findAll();
    }

    // 🔗 assigner machine
    public Employe assignerMachine(Long employeId, Long machineId) {

        Employe emp = employeRepo.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        Machine machine = machineRepo.findById(machineId)
                .orElseThrow(() -> new RuntimeException("Machine introuvable"));

        emp.setMachine(machine);
        return employeRepo.save(emp);
    }
}