# Status
## Sikkerhed på WCF
### og AutoDesktop.Gateway
<!-- .element: class="fragment" -->

---

## Historietime

- Tirsdag bliver vi opmærksomme på brudet
<!-- .element: class="fragment" -->
  - Altså at man ændre company-/enterpriseId
<!-- .element: class="fragment" -->
- Der er ca 1.400 potentielle__ usikre endpoint i WCF
<!-- .element: class="fragment" -->
  - Dertil kommer der ca 100 endpoints i AutoDesktop.Gateway
<!-- .element: class="fragment" -->
- Onsdag retter vi alle (ca 500) trivelle indgange
<!-- .element: class="fragment" -->
- Torsdag har vi fokus på kunder og CRM (200 bliver rettet)
<!-- .element: class="fragment" -->
- Fredag og weekend forsætter vi med kunder/CRM og tager fat i resten (350 løst)
<!-- .element: class="fragment" -->
- Mandag løser vi yderligere 200 endpoints og går i gang med gatewayen
<!-- .element: class="fragment" -->
- Tirsdag er 100 endpoints løst og udgivet i gatewayen
<!-- .element: class="fragment" -->
- Vi har styr på motoren bag - ResourceAuthorizer
<!-- .element: class="fragment" -->
  - Ligger i ADM
<!-- .element: class="fragment" -->
  - Der Logges til supporten
<!-- .element: class="fragment" -->
  - Det ADM ikke understøtter klarer WCF'en selv
<!-- .element: class="fragment" -->

----

## Hvad nu
- I dag har vi 147 endpoints tilbage i WCF
<!-- .element: class="fragment" -->
  - 85 af dem er flow - den skal vi i gang med (Baasch + Rune Neesgaard)
<!-- .element: class="fragment" -->
- Der er en del åbne endpoints pga toyota (Andreas + Ipsen)
<!-- .element: class="fragment" -->
  - Vi har 14 kommentarer (ABCD1234) ifm med at åbne endpoints. Dem skal vi lige have løbet igennem
<!-- .element: class="fragment" -->
- De resterende skal vi have op til overfladen (Lyck)
<!-- .element: class="fragment" -->
- Noget med genbrug af password (Philip)
<!-- .element: class="fragment" -->
- TODO og tomme metoder skal løses i ResourceAuthorizer
<!-- .element: class="fragment" -->
- Caching i stakkels ADM (Neesgaard)
<!-- .element: class="fragment" -->
- Dagens fangst (Benjamin)
<!-- .element: class="fragment" -->