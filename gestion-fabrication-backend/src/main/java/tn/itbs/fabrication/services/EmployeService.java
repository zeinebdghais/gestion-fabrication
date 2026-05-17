package tn.itbs.fabrication.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import tn.itbs.fabrication.converters.EmployeConverter;
import tn.itbs.fabrication.dto.EmployeDTO;
import tn.itbs.fabrication.entities.Employe;
import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.repositories.EmployeRepository;
import tn.itbs.fabrication.repositories.MachineRepository;

@Service
public class EmployeService {
	
	@Autowired
	private EmployeRepository employeRepo;
	
	@Autowired
	private MachineRepository machineRepo;
	
	@Autowired
	private EmployeConverter employeConverter;
	
	public List<EmployeDTO> trouverTousLesEmployes() {
		List<Employe> employes = employeRepo.findAll();
		return employeConverter.toDtoList(employes);
	}
	
	public EmployeDTO trouverEmployeParId(int id) {
		Employe employe = employeRepo.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Employé non trouvé"));
		return employeConverter.toDto(employe);
	}
	
	public void ajouterEmploye(EmployeDTO employeDTO) {
		Employe employe = employeConverter.fromDto(employeDTO);
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
	
	public ResponseEntity<String> mettreAJourEmploye(int id, EmployeDTO employeDTO) {
		employeRepo.findById(id).ifPresentOrElse(
			e -> {
				e.setNom(employeDTO.getNom());
				e.setPoste(employeDTO.getPoste());
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