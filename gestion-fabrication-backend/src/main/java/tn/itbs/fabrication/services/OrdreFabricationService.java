package tn.itbs.fabrication.services;

import org.springframework.stereotype.Service;

import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.entities.OrdreFabrication;
import tn.itbs.fabrication.entities.Produit;
import tn.itbs.fabrication.repositories.MachineRepository;
import tn.itbs.fabrication.repositories.OrdreFabricationRepository;
import tn.itbs.fabrication.repositories.ProduitRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrdreFabricationService {

	private final OrdreFabricationRepository ordreRepo;
    private final ProduitRepository produitRepo;
    private final MachineRepository machineRepo;

    public OrdreFabricationService(
            OrdreFabricationRepository ordreRepo,
            ProduitRepository produitRepo,
            MachineRepository machineRepo) {
        this.ordreRepo = ordreRepo;
        this.produitRepo = produitRepo;
        this.machineRepo = machineRepo;
    }

    public OrdreFabrication creerOrdre(Long produitId, Long machineId, int quantite, String projet) {

        Produit produit = produitRepo.findById(produitId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        Machine machine = machineRepo.findById(machineId)
                .orElseThrow(() -> new RuntimeException("Machine introuvable"));

        if (!"DISPONIBLE".equalsIgnoreCase(machine.getEtat())) {
            throw new RuntimeException("Machine non disponible");
        }

        OrdreFabrication ordre = new OrdreFabrication();
        ordre.setProduit(produit);
        ordre.setMachine(machine);
        ordre.setQuantite(quantite);
        ordre.setProjet(projet);
        ordre.setDate(LocalDate.now());
        ordre.setEtat("EN_ATTENTE");

        return ordreRepo.save(ordre);
    }

    public List<OrdreFabrication> getAll() {
        return ordreRepo.findAll();
    }

    public OrdreFabrication changerEtat(Long id, String etat) {

        OrdreFabrication ordre = ordreRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordre introuvable"));

        // 🔥 Validation simple
        if (!etat.equalsIgnoreCase("EN_ATTENTE") &&
            !etat.equalsIgnoreCase("EN_COURS") &&
            !etat.equalsIgnoreCase("TERMINE")) {
            throw new RuntimeException("Etat invalide");
        }

        ordre.setEtat(etat.toUpperCase());
        return ordreRepo.save(ordre);
    }

    public List<OrdreFabrication> getOrdresEnCours() {
        return ordreRepo.findByEtat("EN_COURS");
    }
 }