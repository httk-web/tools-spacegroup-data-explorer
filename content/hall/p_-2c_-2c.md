---
asym_unit: 0<=x<=1/2; 0<=y<1; 1/4<=z<=3/4
crystal_system: orthorhombic
grid_factors:
  euclidean:
  - 2
  - 1
  - 2
  seminvariant:
  - 2
  - 1
  - 2
  space_group:
  - 1
  - 1
  - 2
hall_key: p_-2c_-2c
hall_latex: \(\mathrm{P}\ \overline{2}_{\mathrm{c}}\ \overline{2}_{\mathrm{c}}\)
harker_planes:
- algebraic: 2*x,0,2*z
  normal:
  - 0
  - 1
  - 0
  point:
  - 0.0
  - 0.0
  - 0.0
is_centric: false
is_chiral: false
is_enantiomorphic: false
is_reference_setting: false
ita_number: 28
laue_class: mmm
n_c: 28:bca
n_ltr: 1
n_smx: 4
order_z: 4
point_group: mm2
qualifier: bca
related_settings:
- hall_key: p_-2a_-2a
  is_reference_setting: false
- hall_key: p_-2b_2
  is_reference_setting: false
- hall_key: p_-2c_-2c
  is_reference_setting: false
- hall_key: p_-2c_2
  is_reference_setting: false
- hall_key: p_2_-2a
  is_reference_setting: true
- hall_key: p_2_-2b
  is_reference_setting: false
schoenflies: C2v^4
short_hm_symbol: Pc2m
short_hm_symbol_latex: ${\mathrm{Pc}2\mathrm{m}}$
slug: p_-2c_-2c
structure_seminvariants:
- modulus: 2
  vector:
  - 1
  - 0
  - 0
- modulus: 0
  vector:
  - 0
  - 1
  - 0
- modulus: 2
  vector:
  - 0
  - 0
  - 1
symops:
- axis:
  - 0
  - 0
  - 0
  origin_shift: 0,0,0
  rot_type: '1'
  screw_glide: 0,0,0
  sense: 0
  xyz: x,y,z
- axis:
  - 0
  - 1
  - 0
  origin_shift: 0,0,0
  rot_type: '2'
  screw_glide: 0,0,0
  sense: 0
  xyz: -x,y,-z
- axis:
  - 1
  - 0
  - 0
  origin_shift: 0,0,0
  rot_type: m
  screw_glide: 0,0,1/2
  sense: 0
  xyz: -x,y,z+1/2
- axis:
  - 0
  - 0
  - 1
  origin_shift: 0,0,1/4
  rot_type: m
  screw_glide: 0,0,0
  sense: 0
  xyz: x,y,-z+1/2
title: Spacegroup p_-2c_-2c
universal_hm: P m a 2 (b,c,a)
universal_hm_latex: ${\mathrm{P} \mathrm{m} \mathrm{a} 2}$ (b,c,a)
url: /hall/p_-2c_-2c/
wyckoff:
  a:
    first_orbit: 0,y,0
    hasfreedom:
    - false
    - true
    - false
    multiplicity: 2
    orbit_affine:
    - - - 0.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - 0.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - 0,y,0
    - 0,y,1/2
    sitesym: .2.
  b:
    first_orbit: 1/2,y,0
    hasfreedom:
    - false
    - true
    - false
    multiplicity: 2
    orbit_affine:
    - - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - 1/2,y,0
    - 1/2,y,1/2
    sitesym: .2.
  c:
    first_orbit: x,y,1/4
    hasfreedom:
    - true
    - true
    - false
    multiplicity: 2
    orbit_affine:
    - - - 1.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 0.25
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - -1.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 0.75
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - x,y,1/4
    - -x,y,3/4
    sitesym: ..m
  d:
    first_orbit: x,y,z
    hasfreedom:
    - true
    - true
    - true
    multiplicity: 4
    orbit_affine:
    - - - 1.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - -1.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - -1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - -1.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 1.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - 1.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 1.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - -1.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - x,y,z
    - -x,y,-z
    - -x,y,z+1/2
    - x,y,-z+1/2
    sitesym: '1'
---
