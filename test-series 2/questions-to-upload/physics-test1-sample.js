// Physics Test 1 - sample (90 questions)
var qs = [
    // 1. Mathematical Physics
    {
        q: "The eigenvalues of the matrix [[2, 1], [1, 2]] are",
        o: ["2 and 2", "1 and 3", "0 and 4", "−1 and 3"],
        a: 1, m: 3, n: 1, img: "",
        exp: "The characteristic equation (2 − λ)² − 1 = 0 gives λ = 1, 3. Check: trace = 4, determinant = 3."
    },
    // 2. Mathematical Physics
    {
        q: "The integral of ∇·(r̂/r²) over the volume of a sphere of radius R centred at the origin is",
        o: ["0", "4πR²", "4π/R²", "4π"],
        a: 3, m: 3, n: 1, img: "",
        exp: "By the divergence theorem the flux of r̂/r² through any sphere is 4π, independent of R. Indeed ∇·(r̂/r²) = 4π δ³(r)."
    },
    // 3. Mathematical Physics
    {
        q: "The residue of f(z) = 1/(z² + 1) at the simple pole z = i is",
        o: ["−i/2", "i/2", "1/2", "2i"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Res = lim (z − i)f(z) = 1/(z + i) at z = i, i.e. 1/(2i) = −i/2."
    },
    // 4. Mathematical Physics
    {
        q: "The Fourier coefficient b₁ of f(x) = x in the interval (−π, π) is",
        o: ["1", "π", "2", "4"],
        a: 2, m: 3, n: 1, img: "",
        exp: "f is odd, so only sine terms appear: bₙ = (1/π)∫ x sin(nx) dx = 2(−1)ⁿ⁺¹/n, hence b₁ = 2."
    },
    // 5. Mathematical Physics
    {
        q: "The value of Γ(5/2) is",
        o: ["√π/2", "3√π/2", "√π", "3√π/4"],
        a: 3, m: 3, n: 1, img: "",
        exp: "Γ(5/2) = (3/2)(1/2)Γ(1/2) = (3/4)√π."
    },
    // 6. Mathematical Physics
    {
        q: "The value of ∫ from −1 to 1 of [P₃(x)]² dx, where P₃ is the Legendre polynomial of degree 3, is",
        o: ["2/7", "2/3", "2/5", "1/7"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Orthogonality gives ∫P_l² dx = 2/(2l + 1). For l = 3 this is 2/7."
    },
    // 7. Mathematical Physics
    {
        q: "For the vector field A = (y, −x, 0), the curl ∇×A is",
        o: ["2 k̂", "0", "−2 k̂", "−k̂"],
        a: 2, m: 3, n: 1, img: "",
        exp: "(∇×A)_z = ∂A_y/∂x − ∂A_x/∂y = (−1) − (1) = −2."
    },
    // 8. Mathematical Physics
    {
        q: "The number of independent components of a symmetric second-rank tensor in three dimensions is",
        o: ["9", "6", "3", "4"],
        a: 1, m: 3, n: 1, img: "",
        exp: "For n dimensions a symmetric tensor has n(n + 1)/2 independent components; for n = 3 this is 6."
    },
    // 9. Mathematical Physics
    {
        q: "The number of independent generators of the group SU(2) is",
        o: ["2", "3", "4", "8"],
        a: 1, m: 3, n: 1, img: "",
        exp: "SU(N) has N² − 1 generators; for N = 2 these are the three Pauli matrices (divided by 2). SU(3) has 8."
    },
    // 10. Classical Mechanics
    {
        q: "The equation of motion of a simple pendulum of length l, obtained from L = ½ml²θ̇² + mgl cos θ, is",
        o: ["d²θ/dt² − (g/l) sin θ = 0", "d²θ/dt² + (g/l) cos θ = 0", "d²θ/dt² + (l/g) sin θ = 0", "d²θ/dt² + (g/l) sin θ = 0"],
        a: 3, m: 3, n: 1, img: "",
        exp: "Euler–Lagrange: d/dt(ml²θ̇) = −mgl sin θ, so θ̈ + (g/l) sin θ = 0."
    },
    // 11. Classical Mechanics
    {
        q: "The number of degrees of freedom of a free rigid body in three-dimensional space is",
        o: ["6", "3", "4", "9"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Three translational (centre of mass) plus three rotational (e.g. Euler angles)."
    },
    // 12. Classical Mechanics
    {
        q: "For a Hamiltonian H(q, p) = p²/2m + V(q), the Poisson bracket {q, H} equals",
        o: ["−V′(q)", "p", "p/m", "p²/2m"],
        a: 2, m: 3, n: 1, img: "",
        exp: "{q, H} = ∂H/∂p = p/m, which is Hamilton’s equation q̇ = p/m."
    },
    // 13. Classical Mechanics
    {
        q: "In an attractive inverse-square force field the orbit of a particle is a parabola when its total energy E is",
        o: ["negative", "positive", "equal to the minimum of the effective potential", "zero"],
        a: 3, m: 3, n: 1, img: "",
        exp: "E < 0 gives an ellipse (a circle at the minimum of V_eff), E = 0 a parabola and E > 0 a hyperbola."
    },
    // 14. Classical Mechanics
    {
        q: "The moment of inertia of a uniform solid sphere of mass M and radius R about a diameter is",
        o: ["(2/5) MR²", "(2/3) MR²", "(1/2) MR²", "(7/5) MR²"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Solid sphere: 2MR²/5. A hollow spherical shell gives 2MR²/3, and (7/5)MR² is the value about a tangent."
    },
    // 15. Classical Mechanics
    {
        q: "In a frame rotating with constant angular velocity ω, the Coriolis force on a particle of mass m moving with velocity v is",
        o: ["−m ω × (ω × r)", "+2m (ω × v)", "−2m (ω × v)", "−m (dω/dt) × r"],
        a: 2, m: 3, n: 1, img: "",
        exp: "Fictitious forces in a rotating frame: Coriolis −2m ω×v, centrifugal −m ω×(ω×r), Euler −m (dω/dt)×r."
    },
    // 16. Classical Mechanics
    {
        q: "If the Lagrangian does not depend explicitly on a generalized coordinate q<sub>i</sub> (a cyclic coordinate), which quantity is conserved?",
        o: ["The total kinetic energy", "The conjugate momentum p<sub>i</sub> = ∂L/∂q̇<sub>i</sub>", "The angular momentum in every case", "The generalized force Q<sub>i</sub>"],
        a: 1, m: 3, n: 1, img: "",
        exp: "The Euler–Lagrange equation gives dp_i/dt = ∂L/∂q_i = 0, so p_i is a constant of motion."
    },
    // 17. Classical Mechanics
    {
        q: "A rod of proper length 1 m moves at 0.6c along its length. Its length measured in the laboratory frame is",
        o: ["0.6 m", "0.8 m", "1.25 m", "0.36 m"],
        a: 1, m: 3, n: 1, img: "",
        exp: "L = L₀√(1 − v²/c²) = 1 × √(1 − 0.36) = 0.8 m."
    },
    // 18. Classical Mechanics
    {
        q: "In Rutherford scattering the differential cross-section dσ/dΩ varies with the scattering angle θ as",
        o: ["1/sin²(θ/2)", "1/cos⁴(θ/2)", "sin⁴(θ/2)", "1/sin⁴(θ/2)"],
        a: 3, m: 3, n: 1, img: "",
        exp: "dσ/dΩ = (Z₁Z₂e²/16πε₀E)² / sin⁴(θ/2)."
    },
    // 19. Classical Mechanics
    {
        q: "A particle has a total energy equal to twice its rest energy. Its speed is",
        o: ["(√3/2) c", "c/2", "c/√2", "3c/4"],
        a: 0, m: 3, n: 1, img: "",
        exp: "γ = 2, so β = √(1 − 1/γ²) = √(3/4) = √3/2."
    },
    // 20. Electrodynamics
    {
        q: "Maxwell added the displacement-current term μ₀ε₀ ∂E/∂t to Ampère’s law mainly to make the equations consistent with",
        o: ["Gauss’s law for magnetism", "Faraday’s law of induction", "charge conservation (the continuity equation)", "the Lorentz force law"],
        a: 2, m: 3, n: 1, img: "",
        exp: "Taking the divergence of ∇×B = μ₀J alone gives ∇·J = 0, contradicting ∂ρ/∂t ≠ 0. The extra term repairs this."
    },
    // 21. Electrodynamics
    {
        q: "The time-averaged intensity of a plane electromagnetic wave of electric-field amplitude E₀ in vacuum is",
        o: ["ε₀ c E₀²", "¼ ε₀ c E₀²", "2 ε₀ c E₀²", "½ ε₀ c E₀²"],
        a: 3, m: 3, n: 1, img: "",
        exp: "⟨S⟩ = E₀B₀/2μ₀ = ½ ε₀ c E₀²."
    },
    // 22. Electrodynamics
    {
        q: "The skin depth of a good conductor varies with the angular frequency ω of an incident wave as",
        o: ["ω<sup>−1/2</sup>", "ω", "ω<sup>−1</sup>", "independent of ω"],
        a: 0, m: 3, n: 1, img: "",
        exp: "δ = √(2/μσω) ∝ 1/√ω."
    },
    // 23. Electrodynamics
    {
        q: "The electric potential at a distance r on the axis of a short electric dipole of moment p is",
        o: ["p/(4πε₀r)", "p/(2πε₀r³)", "p/(4πε₀r²)", "zero"],
        a: 2, m: 3, n: 1, img: "",
        exp: "V = p cos θ/(4πε₀r²); on the axis θ = 0, so V = p/(4πε₀r²)."
    },
    // 24. Electrodynamics
    {
        q: "At the boundary between two linear dielectrics with no free surface charge, which quantity is continuous?",
        o: ["The normal component of E", "The normal component of D", "The tangential component of D", "The normal component of P"],
        a: 1, m: 3, n: 1, img: "",
        exp: "∇·D = ρ_free makes D⊥ continuous; ∇×E = 0 makes E∥ continuous."
    },
    // 25. Electrodynamics
    {
        q: "The power radiated by a non-relativistic accelerated point charge is proportional to",
        o: ["its acceleration", "the square of its acceleration", "the cube of its acceleration", "the inverse of its acceleration"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Larmor formula: P = q²a²/(6πε₀c³)."
    },
    // 26. Electrodynamics
    {
        q: "The Lorenz gauge condition is",
        o: ["∇·A = 0", "∇·A − (1/c²) ∂φ/∂t = 0", "∇·A + c² ∂φ/∂t = 0", "∇·A + (1/c²) ∂φ/∂t = 0"],
        a: 3, m: 3, n: 1, img: "",
        exp: "In the Lorenz gauge the potentials obey decoupled wave equations. ∇·A = 0 is the Coulomb gauge."
    },
    // 27. Electrodynamics
    {
        q: "For light incident from air on glass of refractive index 1.5, the Brewster (polarizing) angle is",
        o: ["tan⁻¹(1.5) ≈ 56.3°", "sin⁻¹(1/1.5) ≈ 41.8°", "45°", "tan⁻¹(1/1.5) ≈ 33.7°"],
        a: 0, m: 3, n: 1, img: "",
        exp: "tan θ_B = n₂/n₁. The 41.8° value is the critical angle for glass to air."
    },
    // 28. Electrodynamics
    {
        q: "The dominant mode of a hollow rectangular waveguide with a > b is",
        o: ["TE₁₁", "TM₁₁", "TE₁₀", "TEM"],
        a: 2, m: 3, n: 1, img: "",
        exp: "A hollow single-conductor guide cannot support TEM. The lowest cutoff (f_c = c/2a) belongs to TE₁₀, while TM modes begin at TM₁₁."
    },
    // 29. Electrodynamics
    {
        q: "The magnetic field deep inside a long solenoid with n turns per unit length carrying a current I is",
        o: ["μ₀nI/2", "μ₀I/(2πr)", "μ₀nI²", "μ₀nI"],
        a: 3, m: 3, n: 1, img: "",
        exp: "Ampère’s law on a rectangular loop gives B = μ₀nI, uniform inside and about zero outside."
    },
    // 30. Quantum Mechanics
    {
        q: "The commutator [x, p²] (with p = −iħ d/dx) is",
        o: ["2iħp", "iħp", "2ħp", "iħ"],
        a: 0, m: 3, n: 1, img: "",
        exp: "[x, p²] = p[x, p] + [x, p]p = 2iħp."
    },
    // 31. Quantum Mechanics
    {
        q: "The energy of the first excited state of a one-dimensional quantum harmonic oscillator of angular frequency ω is",
        o: ["ħω/2", "ħω", "3ħω/2", "2ħω"],
        a: 2, m: 3, n: 1, img: "",
        exp: "E_n = (n + ½)ħω; for n = 1 this is 3ħω/2."
    },
    // 32. Quantum Mechanics
    {
        q: "If the width of an infinite square well is doubled, the ground-state energy of the particle becomes",
        o: ["half of its original value", "one-fourth of its original value", "twice its original value", "four times its original value"],
        a: 1, m: 3, n: 1, img: "",
        exp: "E₁ = π²ħ²/(2mL²) ∝ 1/L²."
    },
    // 33. Quantum Mechanics
    {
        q: "Ignoring spin, the degeneracy of the n = 3 level of the hydrogen atom is",
        o: ["3", "9", "6", "18"],
        a: 1, m: 3, n: 1, img: "",
        exp: "The degeneracy is n² = 9 (l = 0, 1, 2 give 1 + 3 + 5 states). It becomes 18 when spin is included."
    },
    // 34. Quantum Mechanics
    {
        q: "The Heisenberg uncertainty relation between position and momentum is",
        o: ["Δx Δp ≥ ħ", "Δx Δp ≥ h", "Δx Δp ≥ 2ħ", "Δx Δp ≥ ħ/2"],
        a: 3, m: 3, n: 1, img: "",
        exp: "The Kennard bound is σ_x σ_p ≥ ħ/2 (= h/4π)."
    },
    // 35. Quantum Mechanics
    {
        q: "The eigenvalues of S<sub>z</sub> for a spin-½ particle are",
        o: ["±ħ/2", "±ħ", "0 and ħ", "±ħ/√2"],
        a: 0, m: 3, n: 1, img: "",
        exp: "S_z = (ħ/2)σ_z, whose eigenvalues are ±ħ/2."
    },
    // 36. Quantum Mechanics
    {
        q: "The eigenvalue of L² for an electron in a d-state (l = 2) is",
        o: ["2ħ²", "4ħ²", "6ħ²", "3ħ²"],
        a: 2, m: 3, n: 1, img: "",
        exp: "L² = l(l + 1)ħ² = 2·3 ħ² = 6ħ²."
    },
    // 37. Quantum Mechanics
    {
        q: "In non-degenerate time-independent perturbation theory, the first-order correction to the energy E<sub>n</sub> is",
        o: ["Σₘ≠ₙ |⟨ψₘ⁰|H′|ψₙ⁰⟩|² / (Eₙ⁰ − Eₘ⁰)", "⟨ψₙ⁰|H′|ψₘ⁰⟩ with m ≠ n", "always zero", "⟨ψₙ⁰|H′|ψₙ⁰⟩"],
        a: 3, m: 3, n: 1, img: "",
        exp: "The first-order shift is the expectation value of H′ in the unperturbed state. The sum expression is the second-order correction."
    },
    // 38. Quantum Mechanics
    {
        q: "For a particle of energy E incident on a wide rectangular barrier of height V₀ &gt; E and width a, the transmission coefficient is approximately proportional to",
        o: ["exp(−2κa) with κ = √[2m(V₀ − E)]/ħ", "exp(−κa) with κ = √[2m(V₀ − E)]/ħ", "exp(−2κa) with κ = √(2mE)/ħ", "1 − exp(−κa)"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Inside the barrier ψ ∝ e^(−κx), so T ∝ |ψ|² ∝ e^(−2κa)."
    },
    // 39. Quantum Mechanics
    {
        q: "For the hydrogen ground state, the expectation value of the kinetic energy ⟨T⟩ is",
        o: ["−13.6 eV", "+27.2 eV", "+13.6 eV", "+6.8 eV"],
        a: 2, m: 3, n: 1, img: "",
        exp: "For a 1/r potential the virial theorem gives ⟨T⟩ = −E = 13.6 eV and ⟨V⟩ = 2E = −27.2 eV."
    },
    // 40. Quantum Mechanics
    {
        q: "The total wavefunction of a system of two identical fermions must be",
        o: ["symmetric under exchange of the two particles", "antisymmetric under exchange of the two particles", "independent of spin", "real-valued everywhere"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Pauli’s principle: particles of half-integer spin have exchange-antisymmetric wavefunctions."
    },
    // 41. Quantum Mechanics
    {
        q: "According to the variational principle, the expectation value of the Hamiltonian in any normalized trial state is",
        o: ["less than or equal to the ground-state energy", "greater than or equal to the ground-state energy", "equal to the first excited-state energy", "always equal to the ground-state energy"],
        a: 1, m: 3, n: 1, img: "",
        exp: "⟨H⟩ = Σ|cₙ|²Eₙ ≥ E₀, so minimizing over trial functions gives an upper bound for E₀."
    },
    // 42. Thermal & Statistical Physics
    {
        q: "The efficiency of a Carnot engine working between 500 K and 300 K is",
        o: ["60%", "30%", "83%", "40%"],
        a: 3, m: 3, n: 1, img: "",
        exp: "η = 1 − T_c/T_h = 1 − 300/500 = 0.4."
    },
    // 43. Thermal & Statistical Physics
    {
        q: "The entropy change when n moles of an ideal gas expand isothermally and reversibly to twice their volume is",
        o: ["nR ln 2", "nR ln 4", "nR", "zero"],
        a: 0, m: 3, n: 1, img: "",
        exp: "ΔS = nR ln(V₂/V₁) = nR ln 2."
    },
    // 44. Thermal & Statistical Physics
    {
        q: "The Maxwell relation for (∂S/∂V)<sub>T</sub> gives",
        o: ["−(∂P/∂T)<sub>V</sub>", "(∂T/∂P)<sub>V</sub>", "(∂P/∂T)<sub>V</sub>", "−(∂V/∂T)<sub>P</sub>"],
        a: 2, m: 3, n: 1, img: "",
        exp: "From dF = −S dT − P dV, the equality of mixed second derivatives gives (∂S/∂V)_T = (∂P/∂T)_V."
    },
    // 45. Thermal & Statistical Physics
    {
        q: "By the equipartition theorem, the mean total energy of a classical one-dimensional harmonic oscillator at temperature T is",
        o: ["k<sub>B</sub>T/2", "2k<sub>B</sub>T", "3k<sub>B</sub>T/2", "k<sub>B</sub>T"],
        a: 3, m: 3, n: 1, img: "",
        exp: "½k_BT from kinetic energy plus ½k_BT from potential energy."
    },
    // 46. Thermal & Statistical Physics
    {
        q: "The ratio C<sub>p</sub>/C<sub>v</sub> for a monatomic ideal gas is",
        o: ["5/3", "7/5", "4/3", "3/2"],
        a: 0, m: 3, n: 1, img: "",
        exp: "C_v = 3R/2 and C_p = 5R/2. The value 7/5 applies to a diatomic gas at ordinary temperatures."
    },
    // 47. Thermal & Statistical Physics
    {
        q: "At any temperature T &gt; 0, the Fermi–Dirac occupation probability of a state whose energy equals the chemical potential is",
        o: ["0", "1", "1/2", "1/e"],
        a: 2, m: 3, n: 1, img: "",
        exp: "f = 1/(e^((ε−μ)/kT) + 1) = 1/(1 + 1) = 1/2 at ε = μ."
    },
    // 48. Thermal & Statistical Physics
    {
        q: "If the absolute temperature of a black body is doubled, the total power radiated increases by a factor of",
        o: ["2", "16", "4", "8"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Stefan–Boltzmann law: P ∝ T⁴, so the factor is 2⁴ = 16."
    },
    // 49. Thermal & Statistical Physics
    {
        q: "In the canonical ensemble the Helmholtz free energy F is related to the partition function Z by",
        o: ["F = k<sub>B</sub>T ln Z", "F = −k<sub>B</sub>T ln Z", "F = −(1/k<sub>B</sub>T) ln Z", "F = −k<sub>B</sub>T Z"],
        a: 1, m: 3, n: 1, img: "",
        exp: "F = −kT ln Z, from which S = −∂F/∂T and U = −∂ ln Z/∂β follow."
    },
    // 50. Thermal & Statistical Physics
    {
        q: "The density of states of a free-electron gas in three dimensions varies with energy E as",
        o: ["E<sup>−1/2</sup>", "E<sup>3/2</sup>", "constant", "E<sup>1/2</sup>"],
        a: 3, m: 3, n: 1, img: "",
        exp: "g(E) ∝ E^(1/2) in 3D. It is constant in 2D and ∝ E^(−1/2) in 1D."
    },
    // 51. Thermal & Statistical Physics
    {
        q: "The Clausius–Clapeyron equation for a first-order phase transition with latent heat L is",
        o: ["dP/dT = L / [T (V₂ − V₁)]", "dP/dT = L T / (V₂ − V₁)", "dP/dT = T (V₂ − V₁) / L", "dP/dT = L (V₂ − V₁) / T"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Equating chemical potentials along the coexistence curve gives dP/dT = L/(TΔV)."
    },
    // 52. Atomic & Molecular Physics
    {
        q: "The radius of the first Bohr orbit of the hydrogen atom is approximately",
        o: ["1.06 Å", "0.264 Å", "0.529 Å", "5.29 Å"],
        a: 2, m: 3, n: 1, img: "",
        exp: "a₀ = 4πε₀ħ²/(m_e e²) ≈ 0.529 × 10⁻¹⁰ m."
    },
    // 53. Atomic & Molecular Physics
    {
        q: "The wavelength of the first line (Lyman-α) of the Lyman series of hydrogen is about",
        o: ["656.3 nm", "102.6 nm", "486.1 nm", "121.6 nm"],
        a: 3, m: 3, n: 1, img: "",
        exp: "It is the n = 2 → 1 transition. 656.3 nm is Balmer-α, 486.1 nm is Balmer-β and 102.6 nm is Lyman-β."
    },
    // 54. Atomic & Molecular Physics
    {
        q: "In the normal Zeeman effect a single spectral line splits into",
        o: ["three components", "two components", "four components", "five components"],
        a: 0, m: 3, n: 1, img: "",
        exp: "For a singlet transition ΔM = 0, ±1 gives three equally spaced lines separated by μ_B B/h."
    },
    // 55. Atomic & Molecular Physics
    {
        q: "The selection rule for electric-dipole transitions in an atom, with respect to the orbital quantum number l, is",
        o: ["Δl = 0", "Δl = ±2", "Δl = ±1", "Δl = ±3"],
        a: 2, m: 3, n: 1, img: "",
        exp: "The dipole operator has odd parity and rank 1, requiring Δl = ±1 (with Δm = 0, ±1)."
    },
    // 56. Atomic & Molecular Physics
    {
        q: "The ground-state term symbol of the hydrogen atom is",
        o: ["²P<sub>1/2</sub>", "²S<sub>1/2</sub>", "²P<sub>3/2</sub>", "¹S<sub>0</sub>"],
        a: 1, m: 3, n: 1, img: "",
        exp: "n = 1, l = 0, s = ½ gives ²S₁/₂. (¹S₀ is the helium ground state.)"
    },
    // 57. Atomic & Molecular Physics
    {
        q: "In the pure rotational spectrum of a rigid diatomic molecule the adjacent lines are",
        o: ["spaced more widely as J increases", "equally spaced (by 2B)", "spaced more closely as J increases", "randomly spaced"],
        a: 1, m: 3, n: 1, img: "",
        exp: "E_J = BJ(J + 1) and ΔJ = ±1, so lines occur at 2B(J + 1) — equally spaced."
    },
    // 58. Atomic & Molecular Physics
    {
        q: "In Raman spectroscopy the Stokes lines have frequencies that are",
        o: ["higher than that of the incident radiation", "equal to that of the incident radiation", "exactly twice that of the incident radiation", "lower than that of the incident radiation"],
        a: 3, m: 3, n: 1, img: "",
        exp: "The molecule gains vibrational or rotational energy, so the scattered photon has less energy. Anti-Stokes lines are higher in frequency."
    },
    // 59. Atomic & Molecular Physics
    {
        q: "The Landé g-factor for an atom in a ²S<sub>1/2</sub> state is",
        o: ["2", "1", "4/3", "2/3"],
        a: 0, m: 3, n: 1, img: "",
        exp: "g_J = 1 + [J(J+1) + S(S+1) − L(L+1)]/[2J(J+1)] = 1 + (3/4 + 3/4 − 0)/(3/2) = 2."
    },
    // 60. Solid State Physics
    {
        q: "The number of atoms per conventional unit cell of an FCC lattice is",
        o: ["1", "2", "4", "6"],
        a: 2, m: 3, n: 1, img: "",
        exp: "8 corners × 1/8 + 6 faces × 1/2 = 4. (Simple cubic = 1, BCC = 2.)"
    },
    // 61. Solid State Physics
    {
        q: "The atomic packing fraction of a BCC structure is approximately",
        o: ["0.74", "0.52", "0.34", "0.68"],
        a: 3, m: 3, n: 1, img: "",
        exp: "√3π/8 ≈ 0.68. FCC and HCP give 0.74, simple cubic 0.52 and diamond 0.34."
    },
    // 62. Solid State Physics
    {
        q: "X-rays of wavelength 2 Å are reflected in first order from planes of spacing d = 2 Å. The glancing (Bragg) angle is",
        o: ["30°", "45°", "60°", "15°"],
        a: 0, m: 3, n: 1, img: "",
        exp: "2d sin θ = nλ gives sin θ = 2/(2 × 2) = 1/2, so θ = 30°."
    },
    // 63. Solid State Physics
    {
        q: "A plane cuts the crystal axes at a, 2b and ∞c. Its Miller indices are",
        o: ["(1 2 0)", "(1 1 0)", "(2 1 0)", "(2 1 1)"],
        a: 2, m: 3, n: 1, img: "",
        exp: "Intercepts 1, 2, ∞ → reciprocals 1, 1/2, 0 → multiply by 2 → (2 1 0)."
    },
    // 64. Solid State Physics
    {
        q: "According to the Debye model, at very low temperatures the lattice specific heat of an insulating solid varies as",
        o: ["T", "T³", "T²", "a constant (3R)"],
        a: 1, m: 3, n: 1, img: "",
        exp: "C_v = (12π⁴/5) N k (T/θ_D)³ for T ≪ θ_D. The constant 3R is the Dulong–Petit high-temperature limit."
    },
    // 65. Solid State Physics
    {
        q: "The Hall coefficient of a metal in which electrons of concentration n are the charge carriers is",
        o: ["+1/(ne)", "−1/(ne)", "ne", "−ne"],
        a: 1, m: 3, n: 1, img: "",
        exp: "R_H = E_y/(J_x B_z) = −1/(ne) for electrons and +1/(pe) for holes."
    },
    // 66. Solid State Physics
    {
        q: "In the Meissner effect, a superconductor placed in a weak applied magnetic field behaves as",
        o: ["a paramagnet with B = μ₀H", "a perfect conductor with unchanged flux inside", "a ferromagnet with large positive susceptibility", "a perfect diamagnet with B = 0 inside"],
        a: 3, m: 3, n: 1, img: "",
        exp: "The field is expelled (χ = −1). This distinguishes a superconductor from a mere perfect conductor."
    },
    // 67. Solid State Physics
    {
        q: "The Fermi energy of a free-electron gas depends on the electron concentration n as",
        o: ["n<sup>2/3</sup>", "n<sup>1/3</sup>", "n", "n<sup>3/2</sup>"],
        a: 0, m: 3, n: 1, img: "",
        exp: "E_F = (ħ²/2m)(3π²n)^(2/3)."
    },
    // 68. Nuclear & Particle Physics
    {
        q: "The ratio of the nuclear radii of nuclei with mass numbers 27 and 64 is",
        o: ["27 : 64", "9 : 16", "3 : 4", "3 : 8"],
        a: 2, m: 3, n: 1, img: "",
        exp: "R = R₀A^(1/3), so R₁/R₂ = (27/64)^(1/3) = 3/4."
    },
    // 69. Nuclear & Particle Physics
    {
        q: "The activity of a radioactive sample falls to 1/8 of its initial value in 30 days. Its half-life is",
        o: ["15 days", "3.75 days", "20 days", "10 days"],
        a: 3, m: 3, n: 1, img: "",
        exp: "1/8 = (1/2)³, so three half-lives equal 30 days and T½ = 10 days."
    },
    // 70. Nuclear & Particle Physics
    {
        q: "The binding energy per nucleon is maximum (≈ 8.8 MeV) for nuclei with mass number near",
        o: ["A ≈ 56 (iron–nickel region)", "A ≈ 4 (helium)", "A ≈ 12 (carbon)", "A ≈ 238 (uranium)"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Iron-group nuclei are the most tightly bound: fusion of lighter nuclei and fission of heavier nuclei both release energy."
    },
    // 71. Nuclear & Particle Physics
    {
        q: "The continuous energy spectrum of β-particles emitted in β-decay was explained by Pauli’s postulate of",
        o: ["γ-ray emission", "electron capture", "neutrino emission", "isomeric transition"],
        a: 2, m: 3, n: 1, img: "",
        exp: "A three-body final state (daughter nucleus, electron, antineutrino) shares the energy in varying proportions and also conserves spin and angular momentum."
    },
    // 72. Nuclear & Particle Physics
    {
        q: "In the semi-empirical mass formula, the surface-energy term is proportional to",
        o: ["A", "A<sup>2/3</sup>", "A<sup>1/3</sup>", "Z²/A<sup>1/3</sup>"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Nuclear surface area ∝ R² ∝ A^(2/3). The volume term ∝ A and the Coulomb term ∝ Z²/A^(1/3)."
    },
    // 73. Nuclear & Particle Physics
    {
        q: "The quark content of a proton is",
        o: ["udd", "uud", "uus", "uds"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Charges: 2/3 + 2/3 − 1/3 = +1. The neutron is udd."
    },
    // 74. Nuclear & Particle Physics
    {
        q: "Which of the following is NOT conserved in weak interactions?",
        o: ["Electric charge", "Baryon number", "Lepton number", "Parity"],
        a: 3, m: 3, n: 1, img: "",
        exp: "Parity violation in weak decays was shown by Wu et al. (1957, Co-60 β-decay) following the Lee–Yang proposal."
    },
    // 75. Nuclear & Particle Physics
    {
        q: "Which of the following is a nuclear magic number?",
        o: ["28", "30", "36", "100"],
        a: 0, m: 3, n: 1, img: "",
        exp: "Magic numbers: 2, 8, 20, 28, 50, 82, 126."
    },
    // 76. Electronics
    {
        q: "The maximum theoretical rectification efficiency of an ideal full-wave rectifier is",
        o: ["40.6%", "50%", "81.2%", "100%"],
        a: 2, m: 3, n: 1, img: "",
        exp: "η = 8/π² ≈ 81.2%. A half-wave rectifier gives 4/π² ≈ 40.6%."
    },
    // 77. Electronics
    {
        q: "For a transistor with common-emitter current gain β = 99, the common-base current gain α is",
        o: ["0.90", "0.98", "1.01", "0.99"],
        a: 3, m: 3, n: 1, img: "",
        exp: "α = β/(1 + β) = 99/100 = 0.99."
    },
    // 78. Electronics
    {
        q: "An ideal op-amp inverting amplifier has R<sub>f</sub> = 100 kΩ and R<sub>in</sub> = 10 kΩ. Its voltage gain is",
        o: ["−10", "+10", "−11", "+11"],
        a: 0, m: 3, n: 1, img: "",
        exp: "A_v = −R_f/R_in = −10. A non-inverting configuration would give 1 + R_f/R = +11."
    },
    // 79. Electronics
    {
        q: "The Boolean expression A + A′B simplifies to",
        o: ["A", "AB", "A + B", "A′ + B"],
        a: 2, m: 3, n: 1, img: "",
        exp: "A + A′B = (A + A′)(A + B) = A + B by the distributive law."
    },
    // 80. Electronics
    {
        q: "The decimal number 25 in binary is",
        o: ["10011", "11001", "11010", "10101"],
        a: 1, m: 3, n: 1, img: "",
        exp: "25 = 16 + 8 + 1 = 11001₂."
    },
    // 81. Electronics
    {
        q: "The Barkhausen criterion for sustained oscillations in a feedback oscillator requires",
        o: ["loop gain much less than unity with 180° phase shift", "loop gain of unit magnitude and zero (or 2π) total phase shift", "loop gain equal to zero", "loop gain much greater than unity with 90° phase shift"],
        a: 1, m: 3, n: 1, img: "",
        exp: "|Aβ| = 1 and ∠Aβ = 0 (mod 360°): positive feedback that sustains constant amplitude."
    },
    // 82. Electronics
    {
        q: "A JK flip-flop with J = K = 1 will, on each active clock edge,",
        o: ["set its output to 1", "reset its output to 0", "hold its previous output", "toggle its output"],
        a: 3, m: 3, n: 1, img: "",
        exp: "J = K = 1 is the toggle mode, Q(next) = Q′, which is the basis of binary counters."
    },
    // 83. Electronics
    {
        q: "The minimum number of flip-flops needed to build a mod-16 counter is",
        o: ["4", "2", "8", "16"],
        a: 0, m: 3, n: 1, img: "",
        exp: "2⁴ = 16 states, so four flip-flops are required."
    },
    // 84. Optics & Waves
    {
        q: "In Young’s double-slit experiment, if the slit separation is doubled (other quantities unchanged), the fringe width",
        o: ["is doubled", "remains unchanged", "is halved", "becomes four times"],
        a: 2, m: 3, n: 1, img: "",
        exp: "β = λD/d ∝ 1/d."
    },
    // 85. Optics & Waves
    {
        q: "Light of wavelength 600 nm falls on a single slit of width 0.2 mm. The angular position of the first diffraction minimum is approximately",
        o: ["6 × 10⁻³ rad", "3 × 10⁻⁴ rad", "1.2 × 10⁻³ rad", "3 × 10⁻³ rad"],
        a: 3, m: 3, n: 1, img: "",
        exp: "a sin θ = λ gives θ ≈ 6 × 10⁻⁷ / 2 × 10⁻⁴ = 3 × 10⁻³ rad."
    },
    // 86. Optics & Waves
    {
        q: "According to the Rayleigh criterion, the minimum angular separation resolvable by a telescope with a circular aperture of diameter D at wavelength λ is",
        o: ["1.22 λ/D", "λ/D", "1.22 D/λ", "0.61 λ/D"],
        a: 0, m: 3, n: 1, img: "",
        exp: "The first minimum of the Airy pattern lies at sin θ = 1.22 λ/D. (The 0.61 factor appears in the microscope formula for linear resolution.)"
    },
    // 87. Optics & Waves
    {
        q: "The resolving power of a diffraction grating with N illuminated lines in the nth order is",
        o: ["n/N", "N/n", "nN", "n²N"],
        a: 2, m: 3, n: 1, img: "",
        exp: "R = λ/Δλ = nN."
    },
    // 88. Optics & Waves
    {
        q: "Light polarized by a first polarizer passes through a second polarizer whose axis makes 60° with the first. If the intensity after the first is I₀, the intensity after the second is",
        o: ["I₀/2", "I₀/4", "I₀/8", "3I₀/4"],
        a: 1, m: 3, n: 1, img: "",
        exp: "Malus’ law: I = I₀ cos²60° = I₀/4."
    },
    // 89. Optics & Waves
    {
        q: "In a Michelson interferometer, moving one mirror by 0.1 mm shifts 340 fringes. The wavelength of the light is about",
        o: ["294 nm", "588 nm", "680 nm", "500 nm"],
        a: 1, m: 3, n: 1, img: "",
        exp: "2d = Nλ, so λ = 2 × 0.1 mm / 340 ≈ 5.88 × 10⁻⁴ mm = 588 nm."
    },
    // 90. Optics & Waves
    {
        q: "An optical fibre has a core index of 1.5 and a cladding index of 1.4. Its numerical aperture is approximately",
        o: ["0.10", "0.29", "1.07", "0.54"],
        a: 3, m: 3, n: 1, img: "",
        exp: "NA = √(n₁² − n₂²) = √(2.25 − 1.96) = √0.29 ≈ 0.54."
    }
];
