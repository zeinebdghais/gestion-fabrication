package tn.itbs.fabrication.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class OrdreFabricationDTO {
	private int id;
	private String projet;
	private int produitId;
	private int quantite;
	private LocalDate date;
	private String etat;
	private int machineId;

}
