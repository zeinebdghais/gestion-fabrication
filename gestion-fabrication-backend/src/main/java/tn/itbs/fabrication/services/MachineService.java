package tn.itbs.fabrication.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.repositories.MachineRepository;
import java.util.List;
import java.util.Optional;

@Service
public class MachineService {

	@Autowired
    private MachineRepository machineRepo;

    public List<Machine> trouverToutesLesMachines() {
        return machineRepo.findAll();
    }

    public Optional<Machine> trouverMachineParId(int id) {
        return machineRepo.findById(id);
    }

    public List<Machine> trouverMachineParEtat(String etat) {
        return machineRepo.findByEtat(etat);
    }

    public void ajouterMachine(Machine machine) {
        machine.setEtat("Disponible");
        machineRepo.save(machine);
    }

    public ResponseEntity<String> supprimerMachine(int id) {
        machineRepo.findById(id).ifPresentOrElse(
            m -> {
                machineRepo.deleteById(id);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Machine non trouvée");
            }
        );
        return ResponseEntity.ok("Suppression avec succès");
    }

    public ResponseEntity<String> mettreAJourMachine(int id, Machine mach) {
        machineRepo.findById(id).ifPresentOrElse(
            m -> {
                m.setNom(mach.getNom());
                m.setEtat(mach.getEtat());
                m.setDerniereMaintenance(mach.getDerniereMaintenance());
                machineRepo.save(m);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Machine non trouvée");
            }
        );
        return ResponseEntity.ok("Mise à jour avec succès");
    }

    public ResponseEntity<String> planifierMaintenance(int id) {
        machineRepo.findById(id).ifPresentOrElse(
            m -> {
                m.setEtat("En maintenance");
                machineRepo.save(m);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Machine non trouvée");
            }
        );
        return ResponseEntity.ok("Maintenance planifiée avec succès");
    }
}