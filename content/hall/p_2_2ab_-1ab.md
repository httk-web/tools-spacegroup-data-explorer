---
asym_unit: 0<=x<=1/2; 0<=y<=1/4; 0<=z<1
crystal_system: orthorhombic
grid_factors:
  euclidean:
  - 2
  - 2
  - 2
  seminvariant:
  - 2
  - 2
  - 2
  space_group:
  - 2
  - 2
  - 1
hall_key: p_2_2ab_-1ab
hall_latex: \(\mathrm{P}\ 2\ 2_{\mathrm{ab}}\ \overline{1}_{\mathrm{ab}}\)
harker_planes:
- algebraic: 1/2,2*y+1/2,2*z
  normal:
  - 1
  - 0
  - 0
  point:
  - 0.5
  - 0.5
  - 0.0
- algebraic: 2*x+1/2,1/2,2*z
  normal:
  - 0
  - 1
  - 0
  point:
  - 0.5
  - 0.5
  - 0.0
- algebraic: 2*x,2*y,0
  normal:
  - 0
  - 0
  - 1
  point:
  - 0.0
  - 0.0
  - 0.0
is_centric: true
is_chiral: false
is_enantiomorphic: false
is_reference_setting: false
ita_number: 59
laue_class: mmm
n_c: '59:1'
n_ltr: 1
n_smx: 4
order_z: 8
point_group: mmm
qualifier: ''
related_settings:
- hall_key: -p_2ab_2a
  is_reference_setting: true
- hall_key: -p_2c_2a
  is_reference_setting: false
- hall_key: -p_2c_2bc
  is_reference_setting: false
- hall_key: p_2_2ab_-1ab
  is_reference_setting: false
- hall_key: p_2ac_2ac_-1ac
  is_reference_setting: false
- hall_key: p_2bc_2_-1bc
  is_reference_setting: false
schoenflies: D2h^13
short_hm_symbol: Pmmn
short_hm_symbol_latex: ${\mathrm{Pmmn}}$
slug: p_2_2ab_-1ab
structure_seminvariants:
- modulus: 2
  vector:
  - 1
  - 0
  - 0
- modulus: 2
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
  - 1
  - 0
  - 0
  origin_shift: 0,1/4,0
  rot_type: '2'
  screw_glide: 1/2,0,0
  sense: 0
  xyz: x+1/2,-y+1/2,-z
- axis:
  - 0
  - 1
  - 0
  origin_shift: 1/4,0,0
  rot_type: '2'
  screw_glide: 0,1/2,0
  sense: 0
  xyz: -x+1/2,y+1/2,-z
- axis:
  - 0
  - 0
  - 1
  origin_shift: 0,0,0
  rot_type: '2'
  screw_glide: 0,0,0
  sense: 0
  xyz: -x,-y,z
title: Spacegroup p_2_2ab_-1ab
universal_hm: P m m n :2 (a+1/4,b+1/4,c)
universal_hm_latex: ${\mathrm{P} \mathrm{m} \mathrm{m} \mathrm{n} :2}$ (a+1/4,b+1/4,c)
url: /hall/p_2_2ab_-1ab/
wyckoff:
  a:
    first_orbit: 0,0,z
    hasfreedom:
    - false
    - false
    - true
    multiplicity: 2
    orbit_affine:
    - - - 0.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
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
    - - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - -1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - 0,0,z
    - 1/2,1/2,-z
    sitesym: mm2
  b:
    first_orbit: 0,1/2,z
    hasfreedom:
    - false
    - false
    - true
    multiplicity: 2
    orbit_affine:
    - - - 0.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - 1.0
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
        - 0.0
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
    orbit_xyz:
    - 0,1/2,z
    - 1/2,0,-z
    sitesym: mm2
  c:
    first_orbit: 3/4,3/4,0
    hasfreedom:
    - false
    - false
    - false
    multiplicity: 4
    orbit_affine:
    - - - 0.0
        - 0.0
        - 0.0
        - 0.75
      - - 0.0
        - 0.0
        - 0.0
        - 0.75
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
        - 0.25
      - - 0.0
        - 0.0
        - 0.0
        - 0.25
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
        - 0.25
      - - 0.0
        - 0.0
        - 0.0
        - 0.75
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
        - 0.75
      - - 0.0
        - 0.0
        - 0.0
        - 0.25
      - - 0.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - 3/4,3/4,0
    - 1/4,1/4,0
    - 1/4,3/4,0
    - 3/4,1/4,0
    sitesym: '-1'
  d:
    first_orbit: 3/4,3/4,1/2
    hasfreedom:
    - false
    - false
    - false
    multiplicity: 4
    orbit_affine:
    - - - 0.0
        - 0.0
        - 0.0
        - 0.75
      - - 0.0
        - 0.0
        - 0.0
        - 0.75
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - 0.0
        - 0.0
        - 0.0
        - 0.25
      - - 0.0
        - 0.0
        - 0.0
        - 0.25
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - 0.0
        - 0.0
        - 0.0
        - 0.25
      - - 0.0
        - 0.0
        - 0.0
        - 0.75
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - 0.0
        - 0.0
        - 0.0
        - 0.75
      - - 0.0
        - 0.0
        - 0.0
        - 0.25
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - 3/4,3/4,1/2
    - 1/4,1/4,1/2
    - 1/4,3/4,1/2
    - 3/4,1/4,1/2
    sitesym: '-1'
  e:
    first_orbit: 0,y,z
    hasfreedom:
    - false
    - true
    - true
    multiplicity: 4
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
        - 1.0
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
        - -1.0
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
    - - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - -1.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - -1.0
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
        - 0.5
      - - 0.0
        - 0.0
        - -1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - 0,y,z
    - 0,-y,z
    - 1/2,-y+1/2,-z
    - 1/2,y+1/2,-z
    sitesym: m..
  f:
    first_orbit: x,0,z
    hasfreedom:
    - true
    - false
    - true
    multiplicity: 4
    orbit_affine:
    - - - 1.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - 0.0
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
        - 0.0
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
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - -1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - 1.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - -1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - x,0,z
    - -x,0,z
    - -x+1/2,1/2,-z
    - x+1/2,1/2,-z
    sitesym: .m.
  g:
    first_orbit: x,y,z
    hasfreedom:
    - true
    - true
    - true
    multiplicity: 8
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
        - -1.0
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
        - 1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - -1.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - -1.0
        - 0.0
        - 0.5
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
        - 0.5
      - - 0.0
        - 1.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - -1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - 1.0
        - 0.0
        - 0.0
        - 0.0
      - - 0.0
        - -1.0
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
    - - - 1.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - -1.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - -1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    - - - 1.0
        - 0.0
        - 0.0
        - 0.5
      - - 0.0
        - 1.0
        - 0.0
        - 0.5
      - - 0.0
        - 0.0
        - -1.0
        - 0.0
      - - 0.0
        - 0.0
        - 0.0
        - 1.0
    orbit_xyz:
    - x,y,z
    - -x,-y,z
    - -x,y,z
    - -x+1/2,-y+1/2,-z
    - -x+1/2,y+1/2,-z
    - x,-y,z
    - x+1/2,-y+1/2,-z
    - x+1/2,y+1/2,-z
    sitesym: '1'
---
