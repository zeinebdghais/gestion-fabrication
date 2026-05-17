package tn.itbs.fabrication.converters;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tn.itbs.fabrication.dto.MachineDTO;
import tn.itbs.fabrication.entities.Machine;

@Component
public class MachineConverter {

    @Autowired
    private ModelMapper modelMapper;

    public MachineDTO toDto(Machine machine) {
        return modelMapper.map(machine, MachineDTO.class);
    }

    public Machine fromDto(MachineDTO machineDTO) {
        return modelMapper.map(machineDTO, Machine.class);
    }

    public List<MachineDTO> toDtoList(List<Machine> machines) {
        return machines.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<Machine> fromDtoList(List<MachineDTO> machineDTOs) {
        return machineDTOs.stream()
                .map(this::fromDto)
                .collect(Collectors.toList());
    }
}