package tn.itbs.fabrication.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import tn.itbs.fabrication.converters.OrdreFabricationConverter;
import tn.itbs.fabrication.dto.OrdreFabricationDTO;
import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.entities.OrdreFabrication;
import tn.itbs.fabrication.entities.Produit;
import tn.itbs.fabrication.repositories.MachineRepository;
import tn.itbs.fabrication.repositories.OrdreFabricationRepository;
import tn.itbs.fabrication.repositories.ProduitRepository;

@Service
public class OrdreFabricationService {
	
	@Autowired
	private OrdreFabricationRepository ordreRepo;
	
	@Autowired
	private ProduitRepository produitRepo;
	
	@Autowired
	private MachineRepository machineRepo;
	
	@Autowired
	private OrdreFabricationConverter ordreConverter;
	
	public List<OrdreFabricationDTO> trouverTousLesOrdres() {
		List<OrdreFabrication> ordres = ordreRepo.findAll();
		return ordreConverter.toDtoList(ordres);
	}
	
	public OrdreFabricationDTO trouverOrdreParId(int id) {
		OrdreFabrication ordre = ordreRepo.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Ordre non trouvé"));
		return ordreConverter.toDto(ordre);
	}
	
	public List<OrdreFabricationDTO> trouverOrdreParEtat(String etat) {
		List<OrdreFabrication> ordres = ordreRepo.findByEtat(etat);
		return ordreConverter.toDtoList(ordres);
	}
	
	public void creerOrdre(OrdreFabricationDTO ordreDTO) {
		int idProduit = ordreDTO.getProduitId();
		
		produitRepo.findById(idProduit).ifPresentOrElse(
			p -> {
				if (p.getStock() < ordreDTO.getQuantite()) {
					throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Stock insuffisant");
				}
				OrdreFabrication ordre = ordreConverter.fromDto(ordreDTO);
				ordre.setProduit(p);
				ordre.setEtat("En attente");
				ordre.setDate(LocalDate.now());
				ordreRepo.save(ordre);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Produit non trouvé");
			}
		);
	}
	
	public ResponseEntity<String> supprimerOrdre(int id) {
		ordreRepo.findById(id).ifPresentOrElse(
			o -> {
				ordreRepo.deleteById(id);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Ordre non trouvé");
			}
		);
		return ResponseEntity.ok("Suppression avec succès");
	}
	
	public ResponseEntity<String> mettreAJourOrdre(int id, OrdreFabricationDTO ordreDTO) {
		ordreRepo.findById(id).ifPresentOrElse(
			o -> {
				o.setProjet(ordreDTO.getProjet());
				o.setQuantite(ordreDTO.getQuantite());
				o.setDate(ordreDTO.getDate());
				ordreRepo.save(o);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Ordre non trouvé");
			}
		);
		return ResponseEntity.ok("Mise à jour avec succès");
	}
	
	public ResponseEntity<String> assignerMachine(int idOrdre, int idMachine) {
		ordreRepo.findById(idOrdre).ifPresentOrElse(
			o -> {
				Machine machine = machineRepo.findById(idMachine)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Machine non trouvée"));
				
				if (machine.getEtat() == "En panne" || machine.getEtat() == "En maintenance") {
					throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Machine non disponible");
				}
				
				o.setMachine(machine);
				machine.setEtat("En marche");
				machineRepo.save(machine);
				ordreRepo.save(o);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Ordre non trouvé");
			}
		);
		return ResponseEntity.ok("Machine assignée avec succès");
	}
	
	public ResponseEntity<String> demarrerProduction(int id) {
		ordreRepo.findById(id).ifPresentOrElse(
			o -> {
				if (o.getMachine() == null) {
					throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Aucune machine assignée");
				}
				o.setEtat("En cours");
				ordreRepo.save(o);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Ordre non trouvé");
			}
		);
		return ResponseEntity.ok("Production démarrée avec succès");
	}
	
	public ResponseEntity<String> terminerOrdre(int id) {
		ordreRepo.findById(id).ifPresentOrElse(
			o -> {
				if (!o.getEtat().equals("En cours")) {
					throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "L'ordre doit être en cours");
				}
				
				Machine machine = o.getMachine();
				if (machine != null) {
					machine.setEtat("Disponible");
					machineRepo.save(machine);
				}
				
				Produit produit = o.getProduit();
				produit.setStock(produit.getStock() - o.getQuantite());
				produitRepo.save(produit);
				
				o.setEtat("Terminé");
				ordreRepo.save(o);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Ordre non trouvé");
			}
		);
		return ResponseEntity.ok("Ordre terminé avec succès");
	}
	
	public ResponseEntity<String> annulerOrdre(int id) {
		ordreRepo.findById(id).ifPresentOrElse(
			o -> {
				Machine machine = o.getMachine();
				if (machine != null) {
					machine.setEtat("Disponible");
					machineRepo.save(machine);
				}
				o.setEtat("Annulé");
				ordreRepo.save(o);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Ordre non trouvé");
			}
		);
		return ResponseEntity.ok("Ordre annulé avec succès");
	}
}