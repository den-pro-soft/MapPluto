import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import DS from 'ember-data';

import Bookmarkable from './bookmark';
import Geometric from '../mixins/geometric';

// columns requested from server
// update to add more
// 'firm_flag'
// 'pfirm15'

const LotColumnsSQL = [
  'address',
  'bbl',
  'bldgarea',
  'resarea',
  'officearea',
  'retailarea',
  'comarea',
  'garagearea',
  'strgearea',
  'factryarea',
  'otherarea',
  'areasource',
  'builtfar',
  'residfar',
  'commfar',
  'facilfar',
  'bldgclass',
  'block',
  'borough',
  'cd',
  'condono',
  'council',
  'xcoord',
  'ycoord',
  'plutomapid',
  'sanborn',
  'taxmap',
  'appbbl',
  'appdate',
  'proxcode',
  'edesignum',
  'firecomp',
  'healthcent',
  'healtharea',
  'histdist',
  'landmark',
  'ct2010',
  'tract2010',
  'cb2010',
  'assessland',
  'assesstot',
  'exemptland',
  'exempttot',
  'easements',
  'irrlotcode',
  'lottype',
  'landuse',
  'lot',
  'lotarea',
  'lotdepth',
  'lotfront',
  'numbldgs',
  'numfloors',
  'ownername',
  'ownertype',
  'overlay1',
  'overlay2',
  'policeprct',
  'sanitboro',
  'sanitdistr',
  'sanitsub',
  'schooldist',
  'spdist1',
  'spdist2',
  'spdist3',
  'ltdheight',
  'splitzone',
  'unitsres',
  'unitstotal',
  'bldgfront',
  'bldgdepth',
  'ext',
  'bsmtcode',
  'yearbuilt',
  'yearalter1',
  'yearalter2',
  'zipcode',
  'zonedist1',
  'zonedist2',
  'zonedist3',
  'zonedist4',
  'zonemap',
  'zmcode',
];

const SplitZoneDes = {
  N: 'Lot is not split',
  Y: 'Lot is split',
};

const LotTypeDes = {
  0: 'Mixed or Unknown',
  1: 'Block Assemblage',
  2: 'Waterfront',
  3: 'Corner',
  4: 'Through',
  5: 'Inside',
  6: 'Interior Lot',
  7: 'Island Lot',
  8: 'Alley Lot',
  9: 'Submerged Land Lot',
};

const BsmtCodeDes = {
  0: 'None/No Basement',
  1: 'Full Basement that is Above Grade',
  2: 'Full Basement that is Below Grade',
  3: 'Partial Basement that is Above Grade',
  4: 'Partial Basement that is Below Grade',
  5: 'Unknown',
};

const bldgclassLookup = {
  A0: 'One Family Dwellings - Cape Cod',
  A1: 'One Family Dwellings - Two Stories Detached (Small or Moderate Size, With or Without Attic)',
  A2: 'One Family Dwellings - One Story (Permanent Living Quarters)',
  A3: 'One Family Dwellings - Large Suburban Residence',
  A4: 'One Family Dwellings - City Residence',
  A5: 'One Family Dwellings - Attached or Semi-Detached',
  A6: 'One Family Dwellings - Summer Cottages',
  A7: 'One Family Dwellings - Mansion Type or Town House',
  A8: 'One Family Dwellings - Bungalow Colony/Land Coop Owned',
  A9: 'One Family Dwellings - Miscellaneous',

  B1: 'Two Family Dwellings - Brick',
  B2: 'Frame',
  B3: 'Converted From One Family',
  B9: 'Miscellaneous',

  C0: 'Walk-up Apartments - Three Families',
  C1: 'Walk-up Apartments - Over Six Families Without Stores',
  C2: 'Walk-up Apartments - Five to Six Families',
  C3: 'Walk-up Apartments - Four Families',
  C4: 'Walk-up Apartments - Old Law Tenements',
  C5: 'Walk-up Apartments - Converted Dwelling or Rooming House',
  C6: 'Walk-up Apartments - Cooperative',
  C7: 'Walk-up Apartments - Over Six Families With Stores',
  C8: 'Walk-up Apartments - Co-Op Conversion From Loft/Warehouse',
  C9: 'Walk-up Apartments - Garden Apartments',
  CM: 'Mobile Homes/Trailer Parks',

  D0: 'Elevator Apartments - Co-op Conversion from Loft/Warehouse',
  D1: 'Elevator Apartments - Semi-fireproof (Without Stores)',
  D2: 'Elevator Apartments - Artists in Residence',
  D3: 'Elevator Apartments - Fireproof (Without Stores)',
  D4: 'Elevator Apartments - Cooperatives (Other Than Condominiums)',
  D5: 'Elevator Apartments - Converted',
  D6: 'Elevator Apartments - Fireproof With Stores',
  D7: 'Elevator Apartments - Semi-Fireproof With Stores',
  D8: 'Elevator Apartments - Luxury Type',
  D9: 'Elevator Apartments - Miscellaneous',

  E1: 'Warehouses - Fireproof',
  E2: 'Warehouses - Contractor’s Warehouse',
  E3: 'Warehouses - Semi-Fireproof',
  E4: 'Warehouses - Frame, Metal',
  E7: 'Warehouses - Warehouse, Self Storage',
  E9: 'Warehouses - Miscellaneous',

  F1: 'Factory and Industrial Buildings - Heavy Manufacturing - Fireproof',
  F2: 'Factory and Industrial Buildings - Special Construction - Fireproof',
  F4: 'Factory and Industrial Buildings - Semi-Fireproof',
  F5: 'Factory and Industrial Buildings - Light Manufacturing',
  F8: 'Factory and Industrial Buildings - Tank Farms',
  F9: 'Factory and Industrial Buildings - Miscellaneous',

  G: 'GARAGES AND GASOLINE STATIONS',
  0: 'Residential Tax Class 1 Garage',
  1: 'All Parking Garages',
  2: 'Auto Body/Collision or Auto Repair',
  3: 'Gas Station with Retail Store',
  4: 'Gas Station with Service/Auto Repair',
  5: 'Gas Station only with/without Small Kiosk',
  6: 'Licensed Parking Lot',
  7: 'Unlicensed Parking Lot',
  8: 'Car Sales/Rental with Showroom',
  9: 'Miscellaneous Garage or Gas Station',
  U: 'Car Sales/Rental without Showroom',
  W: 'Car Wash or Lubritorium Facility',

  H1: 'Hotels - Luxury Type',
  H2: 'Hotels - Full Service Hotel',
  H3: 'Hotels - Limited Service – Many Affiliated with National Chain',
  H4: 'Hotels - Motels',
  H5: 'Hotels - Private Club, Luxury Type',
  H6: 'Hotels - Apartment Hotels',
  H7: 'Hotels - Apartment Hotels-Co-op Owned',
  H8: 'Hotels - Dormitories',
  H9: 'Hotels - Miscellaneous',
  HB: 'Hotels - Boutique 10-100 Rooms, with Luxury Facilities, Themed, Stylish, with Full Service Accommodations',
  HH: 'Hotels - Hostel-Bed Rental in Dorm Like Setting with Shared Rooms & Bathrooms',
  HR: 'Hotels - SRO- 1 or 2 People Housed in Individual Rooms in Multiple Dwelling Affordable Housing',
  HS: 'Hotels - Extended Stay/Suite Amenities Similar to Apt., Typically Charge Weekly Rates & Less Expensive than Full Service Hotel',

  I1: 'Hospitals and Health - Hospitals, Sanitariums, Mental Institutions',
  I2: 'Hospitals and Health - Infirmary',
  I3: 'Hospitals and Health - Dispensary',
  I4: 'Hospitals and Health - Staff Facilities',
  I5: 'Hospitals and Health - Health Center, Child Center, Clinic',
  I6: 'Hospitals and Health - Nursing Home',
  I7: 'Hospitals and Health - Adult Care Facility',
  I9: 'Hospitals and Health - Miscellaneous',

  J1: 'Theatres - Art Type (Seating Capacity under 400 Seats)',
  J2: 'Theatres - Art Type (Seating Capacity Over 400 Seats)',
  J3: 'Theatres - Motion Picture Theatre with Balcony',
  J4: 'Theatres - Legitimate Theatres (Theatre Sole Use of Building)',
  J5: 'Theatres - Theatre in Mixed Use Building',
  J6: 'Theatres - T.V. Studios',
  J7: 'Theatres - Off-Broadway Type',
  J8: 'Theatres - Multiplex Picture Theatre',
  J9: 'Theatres - Miscellaneous',

  K1: 'Store Buildings (Taxpayers Included) - One Story Retail Building',
  K2: 'Store Buildings (Taxpayers Included) - Multi-Story Retail Building',
  K3: 'Store Buildings (Taxpayers Included) - Multi-Story Department Store',
  K4: 'Store Buildings (Taxpayers Included) - Predominant Retail with Other Uses',
  K5: 'Store Buildings (Taxpayers Included) - Stand Alone Food Establishment',
  K6: 'Store Buildings (Taxpayers Included) - Shopping Centers With or Without Parking',
  K7: 'Store Buildings (Taxpayers Included) - Banking Facilities with or Without Parking',
  K8: 'Store Buildings (Taxpayers Included) - Big Box Retail Not Affixed & Standing On Own Lot with Parking',
  K9: 'Store Buildings (Taxpayers Included) - Miscellaneous',

  L1: 'Loft Buildinghs - Over Eight Stores (Mid-Manhattan Type)',
  L2: 'Loft Buildinghs - Fireproof and Storage Type (Without Stores)',
  L3: 'Loft Buildinghs - Semi-Fireproof',
  L8: 'Loft Buildinghs - With Retail Stores Other Than Type 1',
  L9: 'Loft Buildinghs - Miscellaneous',

  M1: 'Churches, Synagogues, etc. - Church, Synagogue, Chapel',
  M2: 'Churches, Synagogues, etc. - Mission House (Non-Residential)',
  M3: 'Churches, Synagogues, etc. - Parsonage, Rectory',
  M4: 'Churches, Synagogues, etc. - Convents',
  M9: 'Churches, Synagogues, etc. - Miscellaneous',

  N1: 'Asylums and Homes - Asylums',
  N2: 'Asylums and Homes - Homes for Indigent Children, Aged, Homeless',
  N3: 'Asylums and Homes - Orphanages',
  N4: 'Asylums and Homes - Detention House For Wayward Girls',
  N9: 'Asylums and Homes - Miscellaneous',

  O1: 'Office Buildings - Office Only – 1 Story',
  O2: 'Office Buildings - Office Only – 2-6 Stories',
  O3: 'Office Buildings - Office Only – 7-19 Stories',
  O4: 'Office Buildings - Office Only or Office with Comm – 20 Stories or More',
  O5: 'Office Buildings - Office with Comm – 1 to 6 Stories',
  O6: 'Office Buildings - Office with Comm – 7 to 19 Stories',
  O7: 'Office Buildings - Professional Buildings/Stand Alone Funeral Homes',
  O8: 'Office Buildings - Office with Apartments Only (No Comm)',
  O9: 'Office Buildings - Miscellaneous and Old Style Bank Bldgs',

  P1: 'Places of Public Assembly (indoor) and Cultural - Concert Halls',
  P2: 'Places of Public Assembly (indoor) and Cultural - Lodge Rooms',
  P3: 'Places of Public Assembly (indoor) and Cultural - YWCA, YMCA, YWHA, YMHA, PAL',
  P4: 'Places of Public Assembly (indoor) and Cultural - Beach Club',
  P5: 'Places of Public Assembly (indoor) and Cultural - Community Center',
  P6: 'Places of Public Assembly (indoor) and Cultural - Amusement Place, Bathhouse, Boat House',
  P7: 'Places of Public Assembly (indoor) and Cultural - Museum',
  P8: 'Places of Public Assembly (indoor) and Cultural - Library',
  P9: 'Places of Public Assembly (indoor) and Cultural - Miscellaneous',

  Q0: 'Outdoor Recreation Facilities - Open Space',
  Q1: 'Outdoor Recreation Facilities - Parks/Recreation Facilities',
  Q2: 'Outdoor Recreation Facilities - Playground',
  Q3: 'Outdoor Recreation Facilities - Outdoor Pool',
  Q4: 'Outdoor Recreation Facilities - Beach',
  Q5: 'Outdoor Recreation Facilities - Golf Course',
  Q6: 'Outdoor Recreation Facilities - Stadium, Race Track, Baseball Field',
  Q7: 'Outdoor Recreation Facilities - Tennis Court',
  Q8: 'Outdoor Recreation Facilities - Marina, Yacht Club',
  Q9: 'Outdoor Recreation Facilities - Miscellaneous',

  R0: 'Condominiums - Condo Billing Lot',
  R1: 'Condominiums - Residential Unit in 2-10 Unit Bldg',
  R2: 'Condominiums - Residential Unit in Walk-Up Bldg',
  R3: 'Condominiums - Residential Unit in 1-3 Story Bldg',
  R4: 'Condominiums - Residential Unit in Elevator Bldg',
  R5: 'Condominiums - Miscellaneous Commercial',
  R6: 'Condominiums - Residential Unit of 1-3 Unit Bldg-Orig Class 1',
  R7: 'Condominiums - Commercial Unit of 1-3 Units Bldg- Orig Class 1',
  R8: 'Condominiums - Commercial Unit of 2-10 Unit Bldg',
  R9: 'Condominiums - Co-op within a Condominium',
  RA: 'Condominiums - Cultural, Medical, Educational, etc.',
  RB: 'Condominiums - Office Space',
  RC: 'Condominiums - Commercial Building (Mixed Commercial Condo Building Classification Codes)',
  RD: 'Condominiums - Residential Building (Mixed Residential Condo Building Classification Codes)',
  RG: 'Condominiums - Indoor Parking',
  RH: 'Condominiums - Hotel/Boatel',
  RI: 'Condominiums - Mixed Warehouse/Factory/Industrial & Commercial',
  RK: 'Condominiums - Retail Space',
  RM: 'Condominiums - Mixed Residential & Commercial Building (Mixed Residential & Commercial)',
  RP: 'Condominiums - Outdoor Parking',
  RR: 'Condominiums - Condominium Rentals',
  RS: 'Condominiums - Non-Business Storage Space',
  RT: 'Condominiums - Terraces/Gardens/Cabanas',
  RW: 'Condominiums - Warehouse/Factory/Industrial',
  RX: 'Condominiums - Mixed Residential, Commercial & Industrial',
  RZ: 'Condominiums - Mixed Residential & Warehouse',

  S0: 'Residence (Multiple Use) - Primarily One Family with Two Stores or Offices',
  S1: 'Residence (Multiple Use) - Primarily One Family with One Store or Office',
  S2: 'Residence (Multiple Use) - Primarily Two Family with One Store or Office',
  S3: 'Residence (Multiple Use) - Primarily Three Family with One Store or Office',
  S4: 'Residence (Multiple Use) - Primarily Four Family with One Store or Office',
  S5: 'Residence (Multiple Use) - Primarily Five to Six Family with One Store or Office',
  S9: 'Residence (Multiple Use) - Single or Multiple Dwelling with Stores or Offices',

  T1: 'Transportation Facilities (Assessed in ORE) - Airport, Air Field, Terminal',
  T2: 'Transportation Facilities (Assessed in ORE) - Pier, Dock, Bulkhead',
  T9: 'Transportation Facilities (Assessed in ORE) - Miscellaneous',

  U0: 'Utility Bureau Properties - Utility Company Land and Building',
  U1: 'Utility Bureau Properties - Bridge, Tunnel, Highway',
  U2: 'Utility Bureau Properties - Gas or Electric Utility',
  U3: 'Utility Bureau Properties - Ceiling Railroad',
  U4: 'Utility Bureau Properties - Telephone Utility',
  U5: 'Utility Bureau Properties - Communications Facilities Other Than Telephone',
  U6: 'Utility Bureau Properties - Railroad - Private Ownership',
  U7: 'Utility Bureau Properties - Transportation - Public Ownership',
  U8: 'Utility Bureau Properties - Revocable Consent',
  U9: 'Utility Bureau Properties - Miscellaneous',

  V0: 'Vacant Land - Zoned Residential; Not Manhattan',
  V1: 'Vacant Land - Zoned Commercial or Manhattan Residential',
  V2: 'Vacant Land - Zoned Commercial Adjacent to Class 1 Dwelling; Not Manhattan',
  V3: 'Vacant Land - Zoned Primarily Residential; Not Manhattan',
  V4: 'Vacant Land - Police or Fire Department',
  V5: 'Vacant Land - School Site or Yard',
  V6: 'Vacant Land - Library, Hospital or Museum',
  V7: 'Vacant Land - Port Authority of NY and NJ',
  V8: 'Vacant Land - New York State & U.S. Government',
  V9: 'Vacant Land - Miscellaneous',

  W1: 'Educational Structures - Public Elementary, Junior or Senior High',
  W2: 'Educational Structures - Parochial School, Yeshiva',
  W3: 'Educational Structures - School or Academy',
  W4: 'Educational Structures - Training School',
  W5: 'Educational Structures - City University',
  W6: 'Educational Structures - Other College and University',
  W7: 'Educational Structures - Theological Seminary',
  W8: 'Educational Structures - Other Private School',
  W9: 'Educational Structures - Miscellaneous',

  Y1: 'Selected Government Installations (Excluding Office Buildings, Training Schools, Academic, Garages, Warehouses, Piers, Air Fields, Vacant Land, Vacant Sites, and Land Under Water and Easements) - Fire Department',
  Y2: 'Selected Government Installations (Excluding Office Buildings, Training Schools, Academic, Garages, Warehouses, Piers, Air Fields, Vacant Land, Vacant Sites, and Land Under Water and Easements) - Police Department',
  Y3: 'Selected Government Installations (Excluding Office Buildings, Training Schools, Academic, Garages, Warehouses, Piers, Air Fields, Vacant Land, Vacant Sites, and Land Under Water and Easements) - Prison, Jail, House of Detention',
  Y4: 'Selected Government Installations (Excluding Office Buildings, Training Schools, Academic, Garages, Warehouses, Piers, Air Fields, Vacant Land, Vacant Sites, and Land Under Water and Easements) - Military and Naval Installation',
  Y5: 'Selected Government Installations (Excluding Office Buildings, Training Schools, Academic, Garages, Warehouses, Piers, Air Fields, Vacant Land, Vacant Sites, and Land Under Water and Easements) - Department of Real Estate',
  Y6: 'Selected Government Installations (Excluding Office Buildings, Training Schools, Academic, Garages, Warehouses, Piers, Air Fields, Vacant Land, Vacant Sites, and Land Under Water and Easements) - Department of Sanitation',
  Y7: 'Selected Government Installations (Excluding Office Buildings, Training Schools, Academic, Garages, Warehouses, Piers, Air Fields, Vacant Land, Vacant Sites, and Land Under Water and Easements) - Department of Ports and Terminals',
  Y8: 'Selected Government Installations (Excluding Office Buildings, Training Schools, Academic, Garages, Warehouses, Piers, Air Fields, Vacant Land, Vacant Sites, and Land Under Water and Easements) - Department of Public Works',
  Y9: 'Selected Government Installations (Excluding Office Buildings, Training Schools, Academic, Garages, Warehouses, Piers, Air Fields, Vacant Land, Vacant Sites, and Land Under Water and Easements) - Department of Environmental Protection',

  Z0: 'Miscellaneous - Tennis Court, Pool, Shed, etc.',
  Z1: 'Miscellaneous - Court House',
  Z2: 'Miscellaneous - Public Parking Area',
  Z3: 'Miscellaneous - Post Office',
  Z4: 'Miscellaneous - Foreign Government',
  Z5: 'Miscellaneous - United Nations',
  Z7: 'Miscellaneous - Easement',
  Z8: 'Miscellaneous - Cemetery',
  Z9: 'Miscellaneous - Other',
};

const SpDist = {
  125: '125th Street District',
  BPC: 'Battery Park City District',
  BR: 'Bay Ridge District',
  CD: 'City Island District',
  CI: 'Coney Island',
  CL: 'Clinton District',
  CP: 'College Point',
  CO: 'Coney Island Mixed Use District',
  DB: 'Downtown Brooklyn District',
  DJ: 'Downtown Jamaica',
  FH: 'Forest Hills District',
  GC: 'Garment Center District',
  C: 'Grand Concourse Preservation District',
  HS: 'Hillsides Preservation District',
  HSQ: 'Hudson Square District',
  HRP: 'Hudson River Park',
  HY: 'Hudson Yards District',
  HP: 'Hunts Point Special District',
  HRW: 'Harlem River Waterfront District',
  LC: 'Limited Commercial District',
  L: 'Lincoln Square District',
  LI: 'Little Italy District',
  LIC: 'Long Island City Mixed Use District',
  LM: 'Lower Manhattan District',
  MP: 'Madison Avenue Preservation District',
  MID: 'Midtown District',
  MMU: 'Manhattanville Mixed Use District',
  OP: 'Ocean Parkway District',
  PI: 'Park Improvement District',
  PC: 'Planned Community Preservation District',
  SB: 'Sheepshead Bay District',
  SHP: 'Southern Hunters Point District',
  SG: 'St. George District',
  SRD: 'South Richmond Development District',
  SRI: 'Southern Roosevelt Island District',
  TA: 'Transit Land Use District',
  TMU: 'Tribeca Mixed Use District',
  US: 'Union Square District',
  U: 'United Nations Development District',
  WCH: 'West Chelsea',
  WP: 'Willets Point District',

  'CR-1': 'Special Coastal Risk District 1 Broad Channel at Queens',
  'CR-2': 'Special Coastal Risk District 2 Hamilton Beach at Queens',
  'CR-3': 'Special Coastal Risk District 3 Buyout Areas at Staten Island',
  'EC-1': 'Enhanced Commercial District 1 (Fourth Avenue, BK)',
  'EC-2': 'Enhanced Commercial District 2 (Columbus and Amsterdam Avenue)',
  'EC-3': 'Enhanced Commercial District 3 (Broadway, MN)',
  'EC-4': 'Enhanced Commercial District 4 (Bedford Stuyvesant)',
  'EC-5': 'Enhanced Commercial District 5 (BK)',
  'EC-6': 'Enhanced Commercial District 6 (BK)',
  'MX-1': 'Mixed Use District-1 Port Morris (BX)',
  'MX-2': 'Mixed Use District-2 Dumbo (BK)',
  'MX-4': 'Mixed Use District-4 Flushing/Bedford (BK)',
  'MX-5': 'Mixed Use District-5 Red Hook (BK)',
  'MX-6': 'Mixed Use District-6 Hudson Square (MN)',
  'MX-7': 'Mixed Use District-7 Morrisania (BX)',
  'MX-8': 'Mixed Use District-8 Greenpoint Williamsburg(BK)',
  'MX-9': 'Mixed Use District-9 Northern Hunters Point Waterfront (QN)',
  'MX-10': 'Mixed Use District-10 Atlantic and Howard Avenues (BK)',
  'MX-11': 'Mixed Use District - 11 Gowanus (BK)',
  'MX-12': 'Mixed Use District-12 Borough Park (BK)',
  'MX-13': 'Mixed Use District-13 Lower Concourse (BX)',
  'MX-14': 'Mixed Use District-14 Third Avenue /Tremont Avenue (BX)',
  'MX-15': 'Mixed Use District - 15 West Harlem (MN)',
  'MX-16': 'Mixed Use District - 16 Ocean Hill/East New York (BK)',
  'NA-1': 'Natural Area District-1',
  'NA-2': 'Natural Area District-2',
  'NA-3': 'Natural Area District-3',
  'NA-4': 'Natural Area District-4',
  'SV-1': 'Scenic View District',
};

const boroughLookup = {
  BX: 'Bronx',
  BK: 'Brooklyn',
  MN: 'Manhattan',
  QN: 'Queens',
  SI: 'Staten Island',
};

const boroLookup = {
  1: 'Manhattan',
  2: 'Bronx',
  3: 'Brooklyn',
  4: 'Queens',
  5: 'Staten Island',
};

const ownertypeLookup = {
  C: 'City',
  M: 'Mixed City & Private',
  O: 'Public Authority, State, or Federal',
  P: 'Private',
  X: 'Mixed',
};

const landuseLookup = {
  '01': 'One & Two Family Buildings',
  '02': 'Multi-Family Walk-Up Buildings',
  '03': 'Multi-Family Elevator Buildings',
  '04': 'Mixed Residential & Commercial Buildings',
  '05': 'Commercial & Office Buildings',
  '06': 'Industrial & Manufacturing',
  '07': 'Transportation & Utility',
  '08': 'Public Facilities & Institutions',
  '09': 'Open Space & Outdoor Recreation',
  10: 'Parking Facilities',
  11: 'Vacant Land',
};

const HealthInfoDes = {
  1: 'Manhattan',
  2: 'Bronx',
  3: 'Queens',
  4: 'Brooklyn',
  5: 'Staten Island',
};

const AreaSourceDes = {
  0: 'Not Available',
  2: "Department of Finance's RPAD File",
  3: 'One or more Building Dimensions are non-numeric. Total Building Floor Area is 0',
  4: "Building Class is 'V' and Number of Buildings is 0. Total Building Floor Area is 0",
  5: 'Total Building Floor Area is calculated from RPAD Building Dimensions and Number of Stories for largest building only',
  6: 'Unknown',
  7: "Department of Finance's Mass Appraisal System",
  9: 'User',
};

const PlutoMapDes = {
  1: 'In PLUTO Data File and DOF Modified DTM Tax Block and Lot Clipped to the Shoreline File',
  2: 'In PLUTO Data File Only',
  3: 'In DOF Modified DTM Tax Block and Lot Clipped to the Shoreline File but NOT in PLUTO',
  4: 'In PLUTO Data File and in DOF Modified DTM File but NOT in DOF Modified DTM Tax Block and Lot Clipped to the Shoreline File, therefore the tax lot is totally under water',
  5: 'In PLUTO Data File and in DOF Modified DTM File but NOT in DOF Modified DTM Tax Block and Lot Clipped to the Shoreline File, therefore the tax lot is totally under water',
};

const ProxCodeDes = {
  0: 'Not Available',
  1: 'Detatched',
  2: 'Semi-Attached',
  3: 'Attached',
};

const IrrlotCodeDes = {
  N: 'Not a Irregularly Shaped Lot',
  Y: 'Irregularly Shaped Lot',
};

const LtdHeightDes = {
  'LH-1': 'Limited Height District No. 1',
  'LH-1A': 'Limited Height District No. 1A',
  'LH-2': 'Limited Height District No. 2',
  'LH-3': 'Limited Height District No. 3',
};

export default Bookmarkable.extend(Geometric, {
  address: DS.attr('string'),
  bbl: DS.attr('number'),
  bldgarea: DS.attr('number'),
  resarea: DS.attr('number'),
  officearea: DS.attr('number'),
  retailarea: DS.attr('number'),
  comarea: DS.attr('number'),
  garagearea: DS.attr('number'),
  strgearea: DS.attr('number'),
  factryarea: DS.attr('number'),
  otherarea: DS.attr('number'),
  areasource: DS.attr('string'),
  areasourcedes: computed('areasource', function() {
    return AreaSourceDes[this.get('areasource')];
  }),
  builtfar: DS.attr('number'),
  residfar: DS.attr('number'),
  commfar: DS.attr('number'),
  facilfar: DS.attr('number'),
  bldgclass: DS.attr('string'),
  bldgclassname: computed('bldgclass', function() {
    return bldgclassLookup[this.get('bldgclass')];
  }),
  lat: DS.attr('number'),
  lon: DS.attr('number'),
  block: DS.attr('number'),
  borocode: computed('cd', function() {
    const borocd = this.get('cd');
    return borocd.substring(0, 1);
  }),
  boro: alias('borocode'),
  borough: DS.attr('string'),
  boroname: computed('borough', function() {
    return boroughLookup[this.get('borough')];
  }),
  cd: DS.attr('string'),
  cdName: computed('cd', function() {
    const borocd = this.get('cd');
    const boro = borocd.substring(0, 1);
    const cd = parseInt(borocd.substring(1, 3), 10).toString();
    return `${boroLookup[boro]} Community District ${cd}`;
  }),
  cdURLSegment: computed('cd', function() {
    const borocd = this.get('cd');
    const boro = borocd.substring(0, 1);
    const cleanBorough = boroLookup[boro].toLowerCase().replace(/\s/g, '-');
    const cd = parseInt(borocd.substring(1, 3), 10).toString();
    return `${cleanBorough}/${cd}`;
  }),
  condono: DS.attr('number'),
  council: DS.attr('string'),
  xcoord: DS.attr('number'),
  ycoord: DS.attr('number'),
  plutomapid: DS.attr('string'),
  plutomapdes: computed('plutomapid', function() {
    return PlutoMapDes[this.get('plutomapid')];
  }),
  sanborn: DS.attr('string'),
  taxmap: DS.attr('string'),
  appbbl: DS.attr('number'),
  appdate: DS.attr('string'),
  proxcode: DS.attr('string'),
  proxcodedes: computed('proxcode', function() {
    return ProxCodeDes[this.get('proxcode')];
  }),
  edesignum: DS.attr('string'),
  firecomp: DS.attr('string'),
  histdist: DS.attr('string'),
  landmark: DS.attr('string'),
  landuse: DS.attr('string'),
  landusename: computed('landuse', function() {
    return landuseLookup[this.get('landuse')];
  }),
  lot: DS.attr('number'),
  lotarea: DS.attr('number'),
  lotdepth: DS.attr('number'),
  lotfront: DS.attr('number'),
  numbldgs: DS.attr('number'),
  numfloors: DS.attr('number'),
  ownername: DS.attr('string'),
  ownertype: DS.attr('string'),
  ownertypename: computed('ownertype', function() {
    return ownertypeLookup[this.get('ownertype')];
  }),
  ct2010: DS.attr('string'),
  tract2010: DS.attr('string'),
  cb2010: DS.attr('string'),
  assessland: DS.attr('number'),
  assesstot: DS.attr('number'),
  exemptland: DS.attr('number'),
  exempttot: DS.attr('number'),
  easements: DS.attr('number'),
  irrlotcode: DS.attr('string'),
  irrlotcodedes: computed('irrlotcode', function() {
    return IrrlotCodeDes[this.get('irrlotcode')];
  }),
  healthcent: DS.attr('number'),
  healthcentdist: computed('healthcent', function() {
    const hc = this.get('healthcent');
    if (hc >= 11 && hc <= 17) {
      return HealthInfoDes['1'];
    } else if (hc >= 21 && hc <= 26) {
      return HealthInfoDes['2'];
    } else if (hc >= 30 && hc <= 39) {
      return HealthInfoDes['4'];
    } else if (hc >= 41 && hc <= 46) {
      return HealthInfoDes['3'];
    } else if (hc === 51) {
      return HealthInfoDes['5'];
    }
    return null;
  }),
  healtharea: DS.attr('number'),
  lottype: DS.attr('string'),
  lottypedes: computed('lottype', function() {
    return LotTypeDes[this.get('lottype')];
  }),
  overlay1: DS.attr('string'),
  overlay2: DS.attr('string'),
  policeprct: DS.attr('string'),
  sanitboro: DS.attr('string'),
  sanitborodist: computed('sanitboro', function() {
    return HealthInfoDes[this.get('sanitboro')];
  }),
  sanitdistr: DS.attr('string'),
  sanitsub: DS.attr('number'),
  schooldist: DS.attr('string'),
  schooldistdes: computed('schooldist', function() {
    const sd = this.get('schooldist');
    let result = ' School District';
    if ((sd >= 1 && sd <= 6) || sd === 10) {
      result = HealthInfoDes['1'] + result;
    } else if (sd >= 7 && sd <= 12) {
      result = HealthInfoDes['2'] + result;
    } else if ((sd >= 13 && sd <= 23) || sd === 32) {
      result = HealthInfoDes['3'] + result;
    } else if (sd >= 24 && sd <= 30) {
      result = HealthInfoDes['4'] + result;
    } else if (sd === 31) {
      result = HealthInfoDes['5'] + result;
    }
    return result;
  }),
  spdist1: DS.attr('string'),
  spdistdes1: computed('spdist1', function() {
    return SpDist[this.get('spdist1')];
  }),
  spdist2: DS.attr('string'),
  spdistdes2: computed('spdist2', function() {
    return SpDist[this.get('spdist2')];
  }),
  spdist3: DS.attr('string'),
  spdistdes3: computed('spdist3', function() {
    return SpDist[this.get('spdist3')];
  }),
  ltdheight: DS.attr('string'),
  ltdheightdes: computed('ltdheight', function() {
    return LtdHeightDes[this.get('ltdheight')];
  }),
  splitzone: DS.attr('string'),
  splitzonedes: computed('splitzone', function() {
    return SplitZoneDes[this.get('splitzone')];
  }),
  unitsres: DS.attr('number'),
  unitstotal: DS.attr('number'),
  bldgfront: DS.attr('number'),
  bldgdepth: DS.attr('number'),
  ext: DS.attr('string'),
  bsmtcode: DS.attr('string'),
  bsmtcodedes: computed('bsmtcode', function() {
    return BsmtCodeDes[this.get('bsmtcode')];
  }),
  yearbuilt: DS.attr('number'),
  yearalter1: DS.attr('number'),
  yearalter2: DS.attr('number'),
  zipcode: DS.attr('number'),
  zonedist1: DS.attr('string'),
  zonedist2: DS.attr('string'),
  zonedist3: DS.attr('string'),
  zonedist4: DS.attr('string'),
  zonemap: DS.attr('string'),
  zmcode: DS.attr('string'),
});

export { LotColumnsSQL };
