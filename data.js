class data {
  constructor(){
    return console.error("This class cannot be instantiated");
  }
  
  static channels(){
    const ret = {
      botTesting: "577106209706999819",
      listBot: "577105844160954369",
      unverified: "617289687505043469",
      general: "578240040342388776",
      oneWordStory: "713838464860160020",
      botListings: "697504715738579025",
      staffchecks: "625244816006971392",
      suggestions: "712247729929322567"
    }
    return ret;
  }
  
  static roles(){
    const ret = {
      botTesting: "577088015021768704",
      member: "577468959591497729",
      
      
      hSupports: "578665591846731786",
      supports: "577446349977681921",
      tSupports: "711209457018994698",
      support: "711194089357312062",
      
      hMods: "577124069401428008",
      mods: "577123871325421599",
      tMods: "711208322535129178",
      hAdmins: "711196341820325949",
      admins: "594648599992991775",
      moderation: "711193941067956264",
      
      HR: "625241959124172811",
      dev: "577120971257937926",
      coo: "577087560837496832",
      ceo: "577087464615968768",
      management: "711192806118522883",
      
      partnership: "577123762906857506",
      advertisers: "579559964050194442",
    }
    return ret;
  }
  
  static emojis(){
    const ret = {
      check: "722547479136043019",
      cross: "722547543065493614",
      line: "722547601236426832",
    }

    return ret;
  }
}

module.exports = data;