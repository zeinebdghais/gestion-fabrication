package tn.itbs.fabrication.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import tn.itbs.fabrication.converters.MachineConverter;
import tn.itbs.fabrication.dto.MachineDTO;
import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.repositories.MachineRepository;

@Service
public class MachineService {
	
	@Autowired
	private MachineRepository machineRepo;
	
	@Autowired
	private MachineConverter machineConverter;
	
	public List<MachineDTO> trouverToutesLesMachines() {
		List<Machine> machines = machineRepo.findAll();
		return machineConverter.toDtoList(machines);
	}
	
	public MachineDTO trouverMachineParId(int id) {
		Machine machine = machineRepo.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Machine non trouvée"));
		return machineConverter.toDto(machine);
	}
	
	public List<MachineDTO> trouverMachineParEtat(String etat) {
		List<Machine> machines = machineRepo.findByEtat(etat);
		return machineConverter.toDtoList(machines);
	}
	
	public void ajouterMachine(MachineDTO machineDTO) {
		Machine machine = machineConverter.fromDto(machineDTO);
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
	
	public ResponseEntity<String> mettreAJourMachine(int id, MachineDTO machineDTO) {
		machineRepo.findById(id).ifPresentOrElse(
			m -> {
				m.setNom(machineDTO.getNom());
				m.setEtat(machineDTO.getEtat());
				m.setDerniereMaintenance(machineDTO.getDerniereMaintenance());
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
				m.setEtat("EN_MAINTENANCE");
				m.setDerniereMaintenance(LocalDate.now());
				machineRepo.save(m);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Machine non trouvée");
			}
		);
		return ResponseEntity.ok("Maintenance planifiée avec succès");
	}
}