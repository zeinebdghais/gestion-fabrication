package tn.itbs.fabrication.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.itbs.fabrication.entities.OrdreFabrication;
import tn.itbs.fabrication.repositories.OrdreFabricationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdreFabricationService {

    private final OrdreFabricationRepository ordreRepository;

    public List<OrdreFabrication> getAll() {
        return ordreRepository.findAll();
    }

    public OrdreFabrication getById(Long id) {
        return ordreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordre introuvable"));
    }

    public OrdreFabrication create(OrdreFabrication ordre) {
        return ordreRepository.save(ordre);
    }

    public OrdreFabrication update(Long id, OrdreFabrication ordre) {
        OrdreFabrication existing = getById(id);

        existing.setProjet(ordre.getProjet());
        existing.setQuantite(ordre.getQuantite());
        existing.setDate(ordre.getDate());
        existing.setEtat(ordre.getEtat());
        existing.setProduit(ordre.getProduit());
        existing.setMachine(ordre.getMachine());
        existing.setEmploye(ordre.getEmploye());

        return ordreRepository.save(existing);
    }

    public void delete(Long id) {
        ordreRepository.deleteById(id);
    }
}