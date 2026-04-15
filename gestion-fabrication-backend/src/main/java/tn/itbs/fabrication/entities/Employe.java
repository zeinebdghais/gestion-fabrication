package tn.itbs.fabrication.entities;
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
public class Employe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String poste;

    @ManyToMany
    @JoinTable(
        name = "employe_machine",
        joinColumns = @JoinColumn(name = "employe_id"),
        inverseJoinColumns = @JoinColumn(name = "machine_id")
    )
    private List<Machine> machines;

    @OneToMany(mappedBy = "employe")
    @JsonIgnore
    private List<OrdreFabrication> ordresFabrication;
}