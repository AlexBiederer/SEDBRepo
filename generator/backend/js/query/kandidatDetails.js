module.exports = kID => `
  Select k.titel, k.vorname, k.name, p.name as parteiName from kandidat17 k, partei17 p
    where k.partei = p.id and k.id=${kID}
`;
