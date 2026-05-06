package tn.itbs.fabrication.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import tn.itbs.fabrication.entities.Employe;
import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.repositories.EmployeRepository;
import tn.itbs.fabrication.repositories.MachineRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeService {

	@Autowired //initialisation, instantiation
    private EmployeRepository employeRepo;

    @Autowired
    private MachineRepository machineRepo;

    public List<Employe> trouverTousLesEmployes() {
        return employeRepo.findAll();
    }

    public Optional<Employe> trouverEmployeParId(int id) {
        return employeRepo.findById(id);
    }

    public void ajouterEmploye(Employe employe) {
        employeRepo.save(employe);
    }

    public ResponseEntity<String> supprimerEmploye(int id) {
        employeRepo.findById(id).ifPresentOrElse(
            e -> {
                employeRepo.deleteById(id);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Employé non trouvé");
            }
        );
        return ResponseEntity.ok("Suppression avec succès");
    }

    public ResponseEntity<String> mettreAJourEmploye(int id, Employe emp) {
        employeRepo.findById(id).ifPresentOrElse(
            e -> {
                e.setNom(emp.getNom());
                e.setPoste(emp.getPoste());
                e.setMachineAssignee(emp.getMachineAssignee());
                employeRepo.save(e);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Employé non trouvé");
            }
        );
        return ResponseEntity.ok("Mise à jour avec succès");
    }

    public ResponseEntity<String> assignerMachine(int idEmploye, int idMachine) {
        employeRepo.findById(idEmploye).ifPresentOrElse(
            e -> {
                Machine machine = machineRepo.findById(idMachine)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Machine non trouvée"));
                e.setMachineAssignee(machine);
                employeRepo.save(e);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Employé non trouvé");
            }
        );
        return ResponseEntity.ok("Machine assignée avec succès");
    }
}