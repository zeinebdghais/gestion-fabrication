package tn.itbs.fabrication.entities;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 50)
    private String etat;

    @Column(name = "derniere_maintenance")
    private LocalDate derniereMaintenance;

    @OneToMany(mappedBy = "machine")
    @JsonIgnore
    private List<OrdreFabrication> ordresFabrication;

    @ManyToMany(mappedBy = "machines")
    @JsonIgnore
    private List<Employe> employes;
}