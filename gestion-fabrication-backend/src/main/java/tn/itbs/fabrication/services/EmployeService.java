package tn.itbs.fabrication.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.itbs.fabrication.entities.Employe;
import tn.itbs.fabrication.repositories.EmployeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeService {

    private final EmployeRepository employeRepository;

    public List<Employe> getAll() {
        return employeRepository.findAll();
    }

    public Employe getById(Long id) {
        return employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
    }

    public Employe create(Employe employe) {
        return employeRepository.save(employe);
    }

    public Employe update(Long id, Employe employe) {
        Employe existing = getById(id);

        existing.setNom(employe.getNom());
        existing.setPoste(employe.getPoste());
        existing.setMachines(employe.getMachines());

        return employeRepository.save(existing);
    }

    public void delete(Long id) {
        employeRepository.deleteById(id);
    }
}