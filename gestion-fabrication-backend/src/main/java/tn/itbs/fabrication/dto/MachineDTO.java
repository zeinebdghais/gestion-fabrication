package tn.itbs.fabrication.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class MachineDTO {
	private int id;
	private String nom;
	private String etat;
	private LocalDate derniereMaintenance;

}
