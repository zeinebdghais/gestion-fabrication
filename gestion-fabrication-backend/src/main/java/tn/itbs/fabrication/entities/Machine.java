package tn.itbs.fabrication.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Machine {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String etat;

    private LocalDate derniereMaintenance;

    @OneToMany(mappedBy = "machine")
    private List<OrdreFabrication> ordres = new ArrayList<>();

    @OneToMany(mappedBy = "machineAssignee")
    private List<Employe> employes = new ArrayList<>();
}