import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Region {
    id: string;
    name: string;
}

interface RegionSelectProps {
    onChange: (value: {
        province_id?: string;
        province_name?: string;
        regency_id?: string;
        regency_name?: string;
        district_id?: string;
        district_name?: string;
        village_id?: string;
        village_name?: string;
    }) => void;
    value?: {
        province_id?: string;
        regency_id?: string;
        district_id?: string;
        village_id?: string;
    };
}

export function RegionSelect({ onChange, value }: RegionSelectProps) {
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [regencies, setRegencies] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [villages, setVillages] = useState<Region[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<Region | undefined>();
    const [selectedRegency, setSelectedRegency] = useState<Region | undefined>();
    const [selectedDistrict, setSelectedDistrict] = useState<Region | undefined>();
    const [selectedVillage, setSelectedVillage] = useState<Region | undefined>();

    useEffect(() => {
        axios.get('/api/regions/provinces').then(response => {
            // Sort provinces alphabetically by name
            const sortedProvinces = response.data.sort((a: Region, b: Region) => 
                a.name.localeCompare(b.name)
            );
            setProvinces(sortedProvinces);
        });
    }, []);

    useEffect(() => {
        console.log('RegionSelect received value:', value);
        console.log('Provinces available:', provinces.length);
        
        if (value?.province_id && value.province_id !== '' && provinces.length > 0) {
            console.log('Looking for province with ID:', value.province_id);
            const province = provinces.find(p => String(p.id) === String(value.province_id));
            console.log('Found province:', province);
            if (province && province.id !== selectedProvince?.id) {
                setSelectedProvince(province);
            }
        } else {
            console.log('Province selected: undefined (empty or no value)');
            // Only reset if we currently have a selection and value is truly empty
            if (selectedProvince && (!value?.province_id || value.province_id === '')) {
                setSelectedProvince(undefined);
                setSelectedRegency(undefined);
                setSelectedDistrict(undefined);
                setSelectedVillage(undefined);
            }
        }
    }, [value?.province_id, provinces]);

    // Handle regency value from props
    useEffect(() => {
        if (value?.regency_id && value.regency_id !== '' && regencies.length > 0) {
            const regency = regencies.find(r => String(r.id) === String(value.regency_id));
            if (regency && regency.id !== selectedRegency?.id) {
                setSelectedRegency(regency);
            }
        } else if (!value?.regency_id && selectedRegency) {
            setSelectedRegency(undefined);
        }
    }, [value?.regency_id, regencies]);

    // Handle district value from props  
    useEffect(() => {
        if (value?.district_id && value.district_id !== '' && districts.length > 0) {
            const district = districts.find(d => String(d.id) === String(value.district_id));
            if (district && district.id !== selectedDistrict?.id) {
                setSelectedDistrict(district);
            }
        } else if (!value?.district_id && selectedDistrict) {
            setSelectedDistrict(undefined);
        }
    }, [value?.district_id, districts]);

    // Handle village value from props
    useEffect(() => {
        if (value?.village_id && value.village_id !== '' && villages.length > 0) {
            const village = villages.find(v => String(v.id) === String(value.village_id));
            if (village && village.id !== selectedVillage?.id) {
                setSelectedVillage(village);
            }
        } else if (!value?.village_id && selectedVillage) {
            setSelectedVillage(undefined);
        }
    }, [value?.village_id, villages]);

    useEffect(() => {
        if (selectedProvince) {
            console.log('Loading regencies for province:', selectedProvince.id, selectedProvince.name);
            axios.get(`/api/regions/regencies?province_id=${selectedProvince.id}`).then(response => {
                console.log('Regencies loaded:', response.data.length, 'items');
                if (response.data.length === 0) {
                    console.warn('No regencies found for province:', selectedProvince.name, '- Data might not be available for this province');
                }
                console.log('Sample regencies:', response.data.slice(0, 3));
                
                // Sort regencies alphabetically by name
                const sortedRegencies = response.data.sort((a: Region, b: Region) => 
                    a.name.localeCompare(b.name)
                );
                setRegencies(sortedRegencies);
            }).catch(error => {
                console.error('Error loading regencies:', error);
                setRegencies([]); // Reset to empty if error
            });
            
            // Only call onChange if we don't have existing regency value to preserve
            if (!value?.regency_id || value.regency_id === '') {
                const dataToSend = { 
                    province_id: selectedProvince.id, 
                    province_name: selectedProvince.name,
                    regency_id: undefined,
                    regency_name: undefined,
                    district_id: undefined,
                    district_name: undefined,
                    village_id: undefined,
                    village_name: undefined
                };
                console.log('Sending province data to parent:', dataToSend);
                onChange(dataToSend);
            }
        } else {
            setRegencies([]);
            setDistricts([]);
            setVillages([]);
            // Reset all selections when province is cleared
            setSelectedRegency(undefined);
            setSelectedDistrict(undefined);
            setSelectedVillage(undefined);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedRegency) {
            console.log('Loading districts for regency:', selectedRegency.id, selectedRegency.name);
            axios.get(`/api/regions/districts?regency_id=${selectedRegency.id}`).then(response => {
                console.log('Districts loaded:', response.data.length, 'items');
                
                // Sort districts alphabetically by name
                const sortedDistricts = response.data.sort((a: Region, b: Region) => 
                    a.name.localeCompare(b.name)
                );
                setDistricts(sortedDistricts);
            }).catch(error => {
                console.error('Error loading districts:', error);
                setDistricts([]);
            });
            
            // Only send regency data if we don't have existing district value to preserve
            if (!value?.district_id || value.district_id === '') {
                onChange({ 
                    province_id: selectedProvince?.id,
                    province_name: selectedProvince?.name,
                    regency_id: selectedRegency.id, 
                    regency_name: selectedRegency.name,
                    district_id: undefined,
                    district_name: undefined,
                    village_id: undefined,
                    village_name: undefined
                });
            }
        } else {
            setDistricts([]);
            setVillages([]);
            setSelectedDistrict(undefined);
            setSelectedVillage(undefined);
        }
    }, [selectedRegency, selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            console.log('Loading villages for district:', selectedDistrict.id, selectedDistrict.name);
            axios.get(`/api/regions/villages?district_id=${selectedDistrict.id}`).then(response => {
                console.log('Villages loaded:', response.data.length, 'items');
                
                // Sort villages alphabetically by name
                const sortedVillages = response.data.sort((a: Region, b: Region) => 
                    a.name.localeCompare(b.name)
                );
                setVillages(sortedVillages);
            }).catch(error => {
                console.error('Error loading villages:', error);
                setVillages([]);
            });
            
            // Only send district data if we don't have existing village value to preserve
            if (!value?.village_id || value.village_id === '') {
                onChange({ 
                    province_id: selectedProvince?.id,
                    province_name: selectedProvince?.name,
                    regency_id: selectedRegency?.id,
                    regency_name: selectedRegency?.name,
                    district_id: selectedDistrict.id, 
                    district_name: selectedDistrict.name,
                    village_id: undefined,
                    village_name: undefined
                });
            }
        } else {
            setVillages([]);
            setSelectedVillage(undefined);
        }
    }, [selectedDistrict, selectedProvince, selectedRegency]);
    
    useEffect(() => {
        if (selectedVillage) {
            // Send village data while preserving all previous selections
            onChange({ 
                province_id: selectedProvince?.id,
                province_name: selectedProvince?.name,
                regency_id: selectedRegency?.id,
                regency_name: selectedRegency?.name,
                district_id: selectedDistrict?.id,
                district_name: selectedDistrict?.name,
                village_id: selectedVillage.id, 
                village_name: selectedVillage.name 
            });
        }
    }, [selectedVillage, selectedProvince, selectedRegency, selectedDistrict]);

    return (
        <div className="space-y-4 md:col-span-2">
            <div className="space-y-2">
                <label className="text-sm font-medium">Provinsi</label>
                <select
                    value={selectedProvince?.id || ''}
                    onChange={(e) => {
                        console.log('Province onChange event:', e.target.value);
                        const province = provinces.find(p => String(p.id) === e.target.value);
                        console.log('Province selected:', province);
                        setSelectedProvince(province);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Pilih Provinsi...</option>
                    {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                            {province.name}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Kota/Kabupaten</label>
                <select
                    value={selectedRegency?.id || ''}
                    onChange={(e) => {
                        console.log('Regency onChange event:', e.target.value);
                        console.log('Available regencies sample:', regencies.slice(0, 3).map(r => ({id: r.id, type: typeof r.id, name: r.name})));
                        const regency = regencies.find(r => String(r.id) === e.target.value);
                        console.log('Regency selected:', regency);
                        setSelectedRegency(regency);
                    }}
                    disabled={!selectedProvince}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                    <option value="">Pilih Kota/Kabupaten...</option>
                    {regencies.map((regency) => {
                        console.log('Rendering regency option:', regency.id, regency.name);
                        return (
                            <option key={regency.id} value={regency.id}>
                                {regency.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Kecamatan</label>
                <select
                    value={selectedDistrict?.id || ''}
                    onChange={(e) => {
                        console.log('District onChange event:', e.target.value);
                        const district = districts.find(d => String(d.id) === e.target.value);
                        console.log('District selected:', district);
                        setSelectedDistrict(district);
                    }}
                    disabled={!selectedRegency}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                    <option value="">Pilih Kecamatan...</option>
                    {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                            {district.name}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Kelurahan/Desa</label>
                <select
                    value={selectedVillage?.id || ''}
                    onChange={(e) => {
                        console.log('Village onChange event:', e.target.value);
                        const village = villages.find(v => String(v.id) === e.target.value);
                        console.log('Village selected:', village);
                        setSelectedVillage(village);
                    }}
                    disabled={!selectedDistrict}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                    <option value="">Pilih Kelurahan/Desa...</option>
                    {villages.map((village) => (
                        <option key={village.id} value={village.id}>
                            {village.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

interface ComboboxProps {
    items: Region[];
    value?: Region;
    onChange: (value?: Region) => void;
    placeholder: string;
    searchPlaceholder: string;
    disabled?: boolean;
}

function Combobox({ items, value, onChange, placeholder, searchPlaceholder, disabled }: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (typeof onChange === 'function' && search !== '') {
            // Trigger parent to fetch data with search (handled in parent useEffect)
            if (placeholder.toLowerCase().includes('provinsi')) {
                // Only for provinsi, but can be extended for others
                // setProvinceSearch(search) in parent
            }
        }
    }, [search]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value ? value.name : placeholder}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} className="h-9" value={search} onValueChange={setSearch} />
                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                        {items.map((item) => (
                            <CommandItem
                                key={item.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onChange(item);
                                    setOpen(false);
                                }}
                            >
                                {item.name}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        value?.id === item.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}