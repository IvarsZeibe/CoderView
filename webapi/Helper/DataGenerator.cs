using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text.Json;
using webapi.Controllers;
using webapi.Data;
using webapi.Models;
using webapi.ViewModels;

namespace webapi.Helper
{
    class GuideSection
    {
        public string title { get; set; }
        public string content { get; set; }
    }
    
    public class DataGenerator
    {
        string loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent interdum nunc a sapien tincidunt, in hendrerit purus sagittis. Duis suscipit varius nisl, vitae aliquet ex. Nunc eget pulvinar eros, vitae gravida risus. Fusce lacinia massa vitae magna dignissim bibendum. Vestibulum sed vulputate neque. Vivamus efficitur ullamcorper arcu. In hac habitasse platea dictumst. In non ornare tortor. Maecenas eget arcu sed ex semper varius facilisis vel sem.\r\n\r\nAenean vehicula, ligula at gravida pellentesque, ante elit pulvinar ipsum, at dignissim diam erat venenatis metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse ornare ac metus vitae congue. Phasellus felis dui, cursus sed tincidunt ut, lacinia ac felis. Phasellus sollicitudin ante efficitur tellus eleifend, id pulvinar dolor ornare. Morbi quis scelerisque ante. Maecenas auctor finibus enim at mollis. Proin risus ex, laoreet vitae eros quis, tempor iaculis libero. Pellentesque luctus nunc lectus, in finibus felis tristique eget. Integer urna mi, tincidunt sit amet lectus quis, fermentum hendrerit tortor.\r\n\r\nAliquam porttitor neque nulla, semper commodo diam blandit sit amet. Vestibulum ultrices et mi in pulvinar. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam hendrerit eget sapien vel ultricies. Praesent lacus nisi, eleifend ac vulputate a, rhoncus ac diam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce at ipsum mattis, iaculis turpis id, dignissim arcu. Integer dapibus fermentum velit.\r\n\r\nMorbi volutpat hendrerit semper. Curabitur hendrerit faucibus augue. Vestibulum ut erat odio. Maecenas fermentum mauris eget quam commodo mattis. Fusce ultrices leo leo, eget ultrices turpis accumsan vitae. In hac habitasse platea dictumst. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam varius congue quam, quis consectetur justo mollis in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec vulputate nunc magna, hendrerit maximus augue ullamcorper eu. Proin eget sodales libero. Integer maximus malesuada finibus. Aenean eu molestie sapien. Aliquam quis mi sapien. Suspendisse potenti. Suspendisse vel elementum diam, fermentum rhoncus velit.\r\n\r\nInterdum et malesuada fames ac ante ipsum primis in faucibus. Nam interdum ultricies blandit. Duis a varius leo, vel auctor nulla. Aliquam tincidunt scelerisque arcu et suscipit. Pellentesque libero purus, sollicitudin at arcu euismod, rhoncus congue metus. Donec ac arcu ex. Aliquam pellentesque vulputate nulla euismod condimentum.\r\n\r\nIn cursus tellus at iaculis feugiat. Nullam id sapien ex. Suspendisse in magna posuere, finibus justo nec, condimentum tortor. Pellentesque eget justo diam. Suspendisse sit amet enim lectus. Nulla quis odio at justo tincidunt suscipit. Donec lacinia sapien eu semper finibus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer iaculis lorem risus, eu interdum quam bibendum at. Phasellus dignissim aliquam eleifend. Proin ut fermentum augue, luctus tristique nunc. Suspendisse quis interdum augue, faucibus tincidunt risus. Praesent feugiat tincidunt est vitae rhoncus.\r\n\r\nSed tincidunt tortor eget sapien fringilla, ut convallis tortor condimentum. Praesent faucibus mi odio, a tristique est laoreet id. Suspendisse tincidunt sapien mauris, quis commodo ligula faucibus non. Nam consequat fermentum tortor, in blandit orci. Aenean nec efficitur augue, sed bibendum nibh. Curabitur semper leo elit, vel sodales arcu tempor non. Integer vitae volutpat nisl. Fusce elit augue, consequat vitae lectus et, vehicula feugiat justo. Proin quis suscipit odio, mattis condimentum nulla.\r\n\r\nSed non enim vitae dolor placerat maximus in pellentesque ligula. Etiam rhoncus ultrices augue, vel volutpat metus interdum eu. Aenean cursus lacus elementum volutpat faucibus. Nunc dictum felis sit amet nunc mollis sagittis. Nulla euismod ornare lacus ac malesuada. Nam vulputate, neque in consequat cursus, libero quam efficitur odio, ut ornare velit ligula sit amet velit. Vestibulum congue, libero eu placerat auctor, sapien urna scelerisque lectus, nec ultrices justo urna auctor eros. Sed eu eros quam. Sed ornare mollis leo mattis sodales. Donec efficitur eros ut lobortis congue. Suspendisse elementum arcu enim, a suscipit ligula dapibus sit amet.\r\n\r\nVivamus molestie vel justo eu varius. Nulla in nunc quis arcu tristique gravida at non lorem. Ut efficitur mi et libero pellentesque cursus. Fusce ut mollis felis. Donec sagittis luctus quam ac facilisis. Aliquam eu tellus in lectus tincidunt eleifend. Ut molestie purus mauris, nec commodo sem mattis et. Donec vel ultrices arcu. In erat tellus, euismod at malesuada ac, sollicitudin vel lectus. Donec mattis et mi et porttitor. Duis in libero massa. Vestibulum volutpat arcu quis purus egestas, quis semper risus rhoncus. Vestibulum elementum sollicitudin dignissim. Duis sit amet justo nec est tincidunt sollicitudin nec id nisi.\r\n\r\nNulla ex mi, porttitor sagittis vestibulum sit amet, porttitor pulvinar orci. Sed at ligula posuere, rhoncus ex quis, dapibus nisl. Donec consequat, ligula quis consequat congue, sapien velit tempor sapien, id iaculis metus tortor nec risus. Curabitur hendrerit dolor a neque iaculis pharetra. Vestibulum elementum maximus ipsum sed tempus. Morbi sollicitudin, nibh non hendrerit lobortis, ligula nisi iaculis eros, eu ornare leo purus eget erat. Vestibulum ac ante a quam faucibus interdum. Cras fermentum turpis lorem, ac faucibus metus efficitur quis. Nullam pellentesque, tellus non aliquet tempor, tellus leo aliquet nisl, sit amet aliquet felis justo nec purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce ornare laoreet mi sit amet auctor. Donec a eleifend nunc. Etiam rhoncus tortor in turpis porttitor, vel elementum ante volutpat. Nulla odio ex, tincidunt quis tempus quis, consectetur eu urna.\r\n\r\nQuisque eleifend sed turpis ut dictum. Pellentesque egestas semper nisi, non euismod enim euismod vel. Nunc eros velit, fermentum eu magna imperdiet, commodo egestas libero. Vivamus vitae ex in nisi tincidunt feugiat. Vivamus scelerisque lacus augue, et dictum quam interdum nec. Curabitur sit amet sapien eleifend, molestie turpis in, mollis nunc. Proin sit amet consectetur nunc.\r\n\r\nSuspendisse consectetur risus in turpis sodales, sed tincidunt elit consectetur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas sit amet lobortis eros. Vivamus in eros eleifend, blandit mauris nec, tempus nulla. Curabitur luctus metus ut ex tempor facilisis. Quisque dictum lorem diam. Donec egestas mi mi, non ultricies tellus tincidunt eget. Quisque sit amet ex pulvinar, consectetur ex quis, rutrum est. Donec sit amet interdum arcu. Donec id ligula in risus vulputate congue sit amet id justo. Ut posuere convallis nisi, et hendrerit nisl commodo a.\r\n\r\nNam felis dui, dictum vitae pretium vel, aliquet eu urna. Sed vitae ullamcorper quam, vel cursus tellus. Nam laoreet, est in pellentesque feugiat, nibh magna posuere velit, eu congue neque dolor sed arcu. Praesent faucibus eget dui vitae molestie. Etiam et hendrerit felis, a pretium mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean enim tortor, aliquet eget sem vitae, tempor hendrerit odio. Vestibulum tristique mattis laoreet. Cras aliquam leo vitae nunc accumsan, at suscipit mi malesuada. Sed sed erat ipsum. Nulla magna urna, posuere eget vestibulum nec, cursus vel dui. Morbi sollicitudin, ligula at accumsan maximus, felis est aliquam lorem, vitae convallis metus nunc nec nunc. Vestibulum consectetur maximus ipsum, sit amet condimentum augue fringilla eget. Quisque blandit turpis in lorem vulputate pulvinar. Vivamus mi nulla, varius in mi ac, condimentum scelerisque dolor.\r\n\r\nUt massa elit, dapibus nec ligula at, pretium pellentesque sapien. Integer cursus tortor eget tortor ornare sodales. Suspendisse ipsum metus, laoreet non ligula at, aliquet varius metus. Etiam facilisis ex sit amet magna vehicula, at varius lorem pharetra. Donec iaculis tempor elit ut ultrices. Aenean pretium diam quis nunc mattis, vel aliquet purus porttitor. Cras auctor laoreet consectetur. Cras mauris nunc, venenatis et ligula in, euismod blandit diam. Cras ut libero egestas, eleifend ante vel, gravida augue. Nullam fermentum fermentum odio, eget gravida tortor sollicitudin iaculis. Quisque fermentum hendrerit lorem, nec ornare lorem. Integer eget aliquet justo. Aenean eget pulvinar nibh.\r\n\r\nDonec orci magna, vestibulum vel mi et, interdum gravida ante. Morbi diam diam, rhoncus non turpis eget, interdum porta erat. Suspendisse aliquet libero turpis. Proin molestie id mauris ut posuere. Proin ut ornare nibh, ut varius leo. Mauris tincidunt, enim a dapibus dapibus, ligula libero vehicula nunc, sed tempor tellus arcu a eros. In tempor enim eget mi eleifend dictum. In id sodales ex. Fusce blandit lacinia nunc, sit amet dignissim arcu finibus eget. Aliquam porta, sapien a porttitor placerat, felis felis auctor metus, facilisis facilisis lorem enim et enim. Vivamus lectus velit, consectetur in ultricies sed, mollis non est.\r\n\r\nProin sit amet leo sit amet ante congue egestas. Aliquam tincidunt et magna vel eleifend. Morbi sit amet condimentum tortor. Sed a ex dapibus, pellentesque lacus non, fermentum est. Curabitur euismod nisl at nisl pretium, et ultrices massa sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mi odio, aliquet at ligula vel, pulvinar convallis nulla. Cras a neque arcu. In vel ultricies quam, ut tincidunt mi. Maecenas dictum velit neque, vel mattis sem vehicula quis. Integer nulla risus, dapibus ut enim eu, porta fermentum eros. Sed turpis quam, vehicula et facilisis ut, pellentesque non eros. Curabitur luctus gravida turpis, sed interdum neque pulvinar id. Nunc elementum sit amet tellus sit amet pellentesque.\r\n\r\nFusce commodo, velit id malesuada cursus, felis enim ultrices sapien, vitae ullamcorper mi lorem id magna. Vivamus arcu mi, suscipit et mi quis, facilisis finibus turpis. Cras varius eleifend quam a congue. Praesent eget ante ante. Duis eu tellus quam. Proin at ligula ac sapien mollis posuere nec in tortor. Aliquam convallis quam nisi, sed hendrerit tellus feugiat dignissim. Quisque et laoreet sem.\r\n\r\nVestibulum tempus massa et ante aliquet bibendum. Donec ultrices dapibus dui. Curabitur facilisis lectus quis aliquet mattis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer non lacinia orci. Aenean hendrerit neque eu risus accumsan, at suscipit ante dapibus. Pellentesque varius sem nec sapien congue, consequat placerat ligula porttitor. Morbi malesuada malesuada nisl, iaculis condimentum orci ultricies eu. Aliquam felis dolor, vehicula euismod neque vitae, varius pellentesque enim. Aenean vitae ante quis est accumsan malesuada at eu orci. Ut dolor magna, imperdiet quis odio sed, ullamcorper facilisis eros. Etiam eget eros id metus tempus suscipit quis ut urna. Fusce molestie tincidunt mauris, at egestas arcu egestas lobortis. Proin lacus risus, faucibus sit amet malesuada id, consequat quis sapien.\r\n\r\nSuspendisse et rhoncus nunc, nec iaculis libero. Duis lectus dolor, hendrerit ac porta a, venenatis sit amet ipsum. Pellentesque ut eros ut lorem pharetra consequat. Sed a nunc elementum est vehicula rhoncus. Fusce non odio augue. Duis nec ligula condimentum, euismod nibh vel, imperdiet orci. Donec elementum hendrerit mattis. Ut quis malesuada nisl, non tincidunt dui.\r\n\r\nDonec aliquam pretium lacus, at sagittis nisl sodales tincidunt. Morbi sit amet posuere libero. Fusce varius lacus tortor, vel aliquam nunc sagittis at. Fusce scelerisque, lectus eu tincidunt pharetra, justo dui tincidunt ligula, ut aliquet erat turpis id urna. Mauris a mollis nibh. Mauris eu nunc tristique, gravida tellus at, tincidunt nisl. Fusce ut ullamcorper risus.\r\n\r\nSed volutpat quis felis eget sagittis. In facilisis sodales tellus, ut ullamcorper lectus efficitur sit amet. Vestibulum scelerisque eget ligula id eleifend. Vivamus ornare iaculis pretium. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec et tellus ac tortor maximus tempor. Proin in blandit mi. Donec dignissim efficitur accumsan.\r\n\r\nMauris facilisis orci felis, ac tempor eros tincidunt et. Proin quis purus eu erat finibus accumsan quis a nisl. Duis porta vehicula maximus. Cras consequat sem sit amet nunc dignissim, ac mollis magna tristique. Pellentesque accumsan eget magna id scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam fringilla metus mauris, eu accumsan nunc gravida ac. Quisque quam erat, accumsan et tempor vel, facilisis vitae dui. Etiam mollis, neque lobortis placerat posuere, justo mi malesuada ante, ut laoreet metus ante at orci.\r\n\r\nVivamus vestibulum enim nulla, id congue sem congue sed. Nunc non ex cursus, varius orci vel, luctus quam. Nulla porttitor iaculis velit ac scelerisque. Cras nec eros ligula. Etiam molestie lorem vel consequat volutpat. Phasellus lacinia pellentesque ex. Nulla sed malesuada massa. Donec lacinia justo quam, eu ultricies ex porta et. Phasellus cursus metus ut justo suscipit, et laoreet dolor dictum. Cras imperdiet felis non leo faucibus mollis. Maecenas congue neque sapien, vitae pharetra leo eleifend et. Praesent justo enim, dignissim in libero at, mollis euismod lectus.\r\n\r\nNunc ut orci et nisi lobortis dapibus id sit amet est. Fusce vel euismod arcu. Morbi iaculis leo diam, id mollis dui porttitor eu. Duis ac iaculis augue. Curabitur in neque eu nunc faucibus lobortis at sed erat. Sed vehicula risus lorem, a imperdiet est commodo eleifend. Integer scelerisque magna ut felis pellentesque pharetra. Etiam quis tortor eget enim tincidunt congue. Nam sodales diam id enim malesuada aliquet. Duis tincidunt ullamcorper sem quis ullamcorper. Vestibulum laoreet nisi eros, nec auctor justo mollis vitae. In hac habitasse platea dictumst.\r\n\r\nQuisque non dolor at tellus consequat mattis ac vel ipsum. Ut malesuada lectus turpis, sit amet elementum dui imperdiet at. Vestibulum elementum odio sit amet odio sagittis, id pellentesque neque luctus. Etiam cursus sollicitudin vulputate. Donec sit amet sapien non massa lobortis ornare. Pellentesque ac massa at massa venenatis auctor non vitae tellus. Integer enim nisl, convallis et dapibus at, venenatis aliquet massa. Nullam efficitur purus vel felis dapibus eleifend. Suspendisse pellentesque scelerisque gravida. Quisque sodales purus felis, quis dapibus mi ultrices et. Vivamus a porttitor diam, nec luctus neque. Fusce pretium facilisis nulla molestie ornare.\r\n\r\nVestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam lobortis ante vel accumsan tristique. Pellentesque non ex ac orci suscipit ultrices. Phasellus porta blandit tortor quis gravida. Proin consequat, mi a consequat finibus, purus sapien imperdiet odio, suscipit aliquam lacus augue at tellus. In pharetra, lorem fermentum convallis pharetra, mi ante venenatis risus, non aliquam quam purus vel diam. Maecenas vel tristique turpis. Cras convallis sed dui ut aliquam. Maecenas tempus diam ut lacus cursus aliquam. Ut fringilla tortor orci, sit amet efficitur arcu hendrerit eleifend. Duis urna libero, malesuada a felis a, gravida convallis sapien.\r\n\r\nDonec dapibus purus blandit tellus consequat, et pulvinar tortor efficitur. Phasellus commodo luctus ornare. Donec vestibulum ante in dui cursus imperdiet. Etiam at felis interdum, tincidunt lectus vitae, sagittis lorem. Vivamus dictum elit eros, vitae scelerisque quam euismod vel. In non arcu id nisl pharetra congue at sit amet elit. Praesent maximus bibendum metus at iaculis. Nunc blandit arcu in accumsan molestie. Etiam vitae tellus vel dolor accumsan varius nec vel leo.\r\n\r\nVivamus tortor dui, pharetra a ligula vel, pretium vulputate ante. Sed laoreet enim vitae arcu egestas, nec placerat lacus aliquet. Nulla venenatis velit ac augue ornare, et pulvinar erat fermentum. Phasellus dictum, magna laoreet congue commodo, leo lectus tempus ligula, in dignissim felis enim quis eros. Ut est odio, varius sit amet lorem sed, volutpat maximus nulla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean congue purus ac arcu iaculis, sit amet ultricies tellus semper. Integer at malesuada nisi.\r\n\r\nNunc sollicitudin ante erat, vel convallis purus pharetra sed. Nam mauris dolor, condimentum ac sapien sed, commodo luctus nisl. Duis dignissim mattis arcu, eget viverra leo condimentum a. Cras et faucibus mauris. Sed lobortis, elit ut aliquam lacinia, mauris magna condimentum tortor, ut interdum erat sapien quis dui. Morbi vel mi semper, vehicula elit sit amet, malesuada leo. Mauris ac turpis tellus. Proin interdum eros non lacus pellentesque pharetra. Nulla et neque auctor, sagittis neque eget, eleifend sapien. Pellentesque placerat velit risus, non faucibus nibh gravida ac. Maecenas accumsan, sem at convallis vestibulum, felis lectus lobortis est, aliquam faucibus mauris dui sed risus. Donec pulvinar sollicitudin ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam laoreet hendrerit felis, sit amet euismod nunc finibus in.\r\n\r\nCurabitur ac sem vestibulum justo lacinia condimentum. Pellentesque id libero vel ex dapibus iaculis ut at justo. Vivamus sollicitudin vitae sem sit amet interdum. Cras vel gravida velit. Donec eleifend feugiat libero, eu dictum est porta et. Donec eu mattis libero, nec sodales nisl. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam posuere, massa id posuere hendrerit, neque est auctor purus, non dictum dui lectus ut massa.\r\n\r\nNunc ut libero laoreet, molestie diam vitae, imperdiet mauris. Nunc id facilisis nibh. Nullam vulputate semper est, vel gravida arcu lacinia vel. Integer auctor euismod condimentum. Proin euismod commodo velit, ut malesuada tellus tristique et. Etiam pulvinar congue felis, tempus pellentesque turpis ultrices vitae. Vestibulum faucibus, tellus vitae porttitor consequat, ipsum lorem dapibus tellus, ac aliquet eros lectus eget nulla. In sagittis diam lacus, ut mollis sem volutpat a. Nam vel sapien nec purus rhoncus luctus ac in urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent tincidunt est id eros accumsan, ut efficitur sem porta. Etiam ultricies orci nisl, id rhoncus velit interdum vel.\r\n\r\nSuspendisse convallis a tortor vitae vehicula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum orci eu tempor blandit. Etiam vel tincidunt risus. Integer sollicitudin, elit et malesuada venenatis, risus libero cursus lorem, sed lobortis magna neque vitae ex. In vitae posuere dolor. Nam condimentum, nisl vitae tristique porta, ex felis pretium nisl, sed hendrerit est est sed nisl. Morbi finibus rutrum lectus quis mollis. Suspendisse tincidunt elit nec egestas egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus suscipit sapien, ac porttitor elit maximus gravida. Duis neque purus, tincidunt quis dui sit amet, euismod efficitur mauris. Etiam et lectus justo. Aliquam aliquam non augue ac ornare.\r\n\r\nSed in accumsan eros. Integer placerat, neque non hendrerit lobortis, ante orci imperdiet dui, in eleifend urna erat in justo. Aenean varius, elit eget rutrum ultricies, nibh urna mollis velit, et blandit elit est in magna. Nam vitae dolor leo. Nullam mattis ligula rutrum enim interdum, interdum tincidunt odio blandit. Pellentesque pharetra mauris rhoncus eros sagittis, sit amet tincidunt quam malesuada. Suspendisse potenti.\r\n\r\nNunc vestibulum risus rhoncus urna pharetra, nec vestibulum dui placerat. Sed ullamcorper tellus vitae leo tempor, elementum fermentum nunc lobortis. Praesent at neque sit amet eros cursus maximus et sit amet mauris. Nulla enim quam, auctor quis est aliquet, pulvinar suscipit mauris. Duis porttitor, turpis nec lacinia facilisis, sapien mi placerat sem, nec pharetra tortor est sit amet quam. Duis id fringilla velit. Phasellus sollicitudin odio mauris, quis dictum dolor bibendum non.\r\n\r\nSed aliquet mollis suscipit. Nunc quis efficitur risus. Aliquam feugiat, lectus at malesuada interdum, diam neque lacinia purus, vel blandit metus orci eu nulla. Aliquam erat volutpat. Suspendisse ultricies ultrices massa vitae molestie. Aliquam pretium in ante at iaculis. Cras iaculis consequat augue, eu dapibus dolor venenatis at. Praesent nec facilisis purus, sit amet lacinia eros. Praesent cursus augue tristique dui iaculis, vel aliquam leo pretium. Ut pellentesque libero eleifend dolor blandit commodo. Quisque iaculis ornare felis, quis aliquet est sodales eu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed tincidunt maximus quam ac bibendum. Curabitur orci magna, pharetra at est sed, vehicula pulvinar justo. Phasellus imperdiet ullamcorper dictum.\r\n\r\nEtiam vitae diam arcu. Curabitur egestas nec ex quis ultrices. Vivamus a mauris eget eros consectetur rhoncus id id libero. Maecenas non quam at odio sagittis luctus. Suspendisse potenti. Morbi purus est, molestie et risus vitae, volutpat fermentum enim. Cras sed commodo quam. Praesent eu ullamcorper urna, non sollicitudin quam. Nunc rhoncus convallis suscipit. In tristique commodo felis, nec condimentum arcu mattis egestas. Vestibulum facilisis massa aliquet, pulvinar tortor a, aliquet justo. Proin cursus volutpat augue ac euismod. Nullam viverra nisi dolor, non pellentesque lorem euismod a. Vivamus ornare vehicula nisl. Vivamus facilisis tempus augue, id pharetra lacus vehicula a. Suspendisse ultrices justo turpis, ac lobortis lacus congue a.\r\n\r\nDonec et massa risus. Proin molestie pulvinar tortor, mollis venenatis elit molestie et. Fusce purus enim, porta eu lectus a, congue porttitor nunc. Vestibulum fringilla consequat viverra. Aenean sit amet tellus dictum, luctus est at, ultrices velit. Aliquam rhoncus, risus quis sodales placerat, lectus dolor lobortis enim, quis luctus elit nibh sed massa. Aliquam facilisis ac libero eget tincidunt. Aliquam massa orci, molestie pretium ex vel, consectetur tempus mi. Sed a mi vehicula, volutpat nisl non, viverra justo. Sed vel ligula ac enim viverra feugiat sit amet sit amet dui. Maecenas in lobortis lectus, ut maximus sem. Duis tempor consectetur purus vitae pharetra. Proin eu elit vitae lorem interdum pretium at sit amet urna.\r\n\r\nNulla porta auctor risus, non pretium quam pellentesque eu. Nunc in varius mauris. Suspendisse eget iaculis sapien, in ultricies tortor. Suspendisse imperdiet bibendum mauris, sit amet faucibus eros sollicitudin non. Pellentesque sit amet sollicitudin neque. Mauris porttitor, lacus sed molestie vulputate, odio lorem mollis ex, et eleifend dolor risus in risus. Ut eu rutrum metus. Sed non eros risus. Mauris nec iaculis justo. Duis mi metus, tincidunt id tortor ut, facilisis pellentesque dui.\r\n\r\nNam iaculis ultricies euismod. In lobortis, ligula ut vestibulum molestie, diam libero feugiat nisi, in hendrerit diam eros non augue. Nunc mi urna, ornare ac libero nec, pharetra egestas purus. Curabitur a aliquam dolor. Etiam id malesuada elit. Duis ac leo at mi venenatis venenatis non et erat. Proin sed nisl sed metus maximus commodo. Praesent euismod euismod neque, vitae rhoncus eros lobortis et. Aliquam dignissim auctor volutpat. Vivamus congue at leo id efficitur. Donec quis leo sem. Proin orci dolor, laoreet accumsan blandit id, mattis id felis.\r\n\r\nDonec turpis urna, ultricies nec auctor in, tempus at nibh. Nam nec risus et ipsum vulputate porta porttitor eget massa. Sed consequat consequat semper. Suspendisse varius interdum ipsum, sed commodo turpis aliquam sit amet. Mauris tortor felis, eleifend sit amet varius sit amet, placerat vel odio. Proin ultricies ante auctor pulvinar viverra. In venenatis diam turpis, a malesuada nisl tempor vel. Vivamus vel ultricies justo. Quisque lectus nisl, dignissim sodales ipsum elementum, sodales auctor risus. Sed lobortis cursus tincidunt. Ut vel risus odio. Phasellus venenatis, est ut congue laoreet, urna ex scelerisque metus, non elementum nulla risus non sapien. Curabitur eu metus nec massa molestie sollicitudin. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce bibendum ante vitae semper pharetra. Vivamus sed enim a urna feugiat condimentum non auctor mauris.\r\n\r\nInteger vehicula mi a augue feugiat, a ultricies lectus efficitur. Sed massa eros, fermentum non velit sed, congue venenatis dolor. Pellentesque pharetra ornare sollicitudin. Nunc accumsan consectetur orci in fringilla. Pellentesque ornare elementum ipsum, in interdum ligula viverra vitae. Vestibulum interdum vehicula enim, at pulvinar libero sagittis quis. Nunc hendrerit leo at porttitor pretium. Vivamus euismod magna facilisis auctor tincidunt. Pellentesque placerat mauris ligula, et condimentum dui suscipit quis. Sed a urna rhoncus, placerat dui ornare, luctus mauris. Fusce ac erat nunc. Donec faucibus a risus nec efficitur. Nam eget nunc ut elit porttitor imperdiet. Curabitur turpis sapien, ultricies ut eleifend vel, hendrerit non nunc.\r\n\r\nDonec molestie ornare pretium. Quisque commodo, ligula vel iaculis dapibus, est ex ultrices mauris, a pretium elit felis sed ante. Vestibulum sit amet ligula nisi. Donec venenatis, mauris in malesuada tempus, nunc sem fringilla lacus, ut faucibus nunc nulla et lorem. Nam vitae ligula ac urna vestibulum ultrices eget id leo. In sed turpis mollis, imperdiet ligula sit amet, aliquet arcu. Aenean auctor turpis dolor, ut tristique neque porta vitae. Pellentesque neque nibh, molestie sed placerat vitae, malesuada id leo. Integer leo justo, facilisis ut risus ut, feugiat aliquam massa. Suspendisse quis purus vitae lorem egestas venenatis ac non lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus.\r\n\r\nPraesent consequat, turpis ac molestie congue, ligula sem ornare enim, sit amet blandit justo justo eget dui. Suspendisse vitae felis eu odio fringilla fermentum. Morbi mauris enim, blandit at tortor ut, cursus cursus urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla ex urna, aliquam id tincidunt ac, interdum eu lacus. Donec semper turpis a posuere lobortis. Nulla dictum leo ac elit posuere, eu hendrerit lectus maximus. Suspendisse tortor neque, fermentum non ipsum ac, mattis bibendum nisl. Nulla rhoncus lectus non metus volutpat malesuada. Pellentesque placerat justo id vehicula commodo.\r\n\r\nSuspendisse mollis quam quis tristique pellentesque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tempor fermentum leo nec ornare. Mauris at tempor purus, id commodo nisi. Suspendisse cursus lacus non magna posuere, eu euismod risus cursus. Nulla ut lorem rhoncus, luctus massa at, feugiat turpis. In hac habitasse platea dictumst. Curabitur faucibus placerat dui vitae varius. Aliquam aliquet neque at augue sagittis egestas. Etiam dictum, nisl nec congue ultrices, nulla dui congue mi, nec commodo nulla magna eu nulla. Aenean vitae ante tincidunt ante condimentum luctus.\r\n\r\nUt auctor, purus mollis blandit iaculis, tortor diam posuere nunc, a elementum augue massa eu lectus. Donec vehicula neque sed eros elementum, et interdum odio efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus id rhoncus tellus. In in massa et mauris finibus bibendum. Suspendisse consequat volutpat pulvinar. Donec vehicula sem at porttitor ultricies. Nulla vel odio felis. Aliquam ac turpis ultrices, luctus est ut, cursus risus. Aliquam eget dapibus sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis ullamcorper sapien. Curabitur ipsum leo, malesuada quis egestas eget, gravida et sem. Vestibulum ornare elementum tellus sit amet egestas. Aliquam quam quam, fermentum vitae nisi et, ultricies vulputate mi. Quisque faucibus finibus imperdiet.\r\n\r\nIn hendrerit aliquet arcu nec gravida. Sed fermentum tincidunt sem, in lobortis velit pellentesque a. Sed in arcu ac turpis cursus dapibus id eu eros. Nunc et ligula ipsum. Mauris lectus odio, convallis sit amet dolor in, consectetur facilisis elit. Ut a erat eu erat vulputate cursus. Nam lectus lacus, gravida eu vestibulum nec, tempor placerat eros. Cras pulvinar ullamcorper facilisis. In hac habitasse platea dictumst. Proin non pretium eros. Integer sodales ut elit sit amet rutrum.\r\n\r\nDuis dictum facilisis ornare. Fusce eu lacus sit amet elit vulputate tempus consectetur sed magna. Integer eget facilisis diam, in efficitur sapien. Suspendisse justo odio, pretium consequat iaculis eget, vulputate id mi. Fusce iaculis nec lorem eu pretium. Fusce eu nibh porttitor, pellentesque est convallis, lobortis elit. Nulla gravida faucibus placerat. Phasellus malesuada justo sed felis consectetur mollis. Nullam ipsum est, eleifend rutrum venenatis malesuada, dictum a erat.\r\n\r\nNam nec tincidunt velit. Aliquam venenatis odio sed orci posuere feugiat. Nullam blandit et eros nec posuere. Nam finibus cursus est sit amet sodales. Phasellus semper, magna eu auctor tincidunt, orci massa luctus est, nec ornare ex nibh eget lacus. Sed scelerisque leo in pretium tincidunt. Sed sagittis lacinia vehicula. Integer arcu dolor, pretium at lacus ac, dapibus suscipit enim. Praesent id posuere ante, id bibendum neque. Cras at sem sit amet velit convallis fermentum. Nunc augue diam, dictum et sollicitudin id, ultrices eget nisl. Sed a libero dignissim, porttitor sapien non, viverra nulla. Suspendisse sapien ligula, rutrum a diam id, iaculis accumsan risus. Donec in ex eget diam vestibulum porta. Nullam fermentum ante non nibh hendrerit lacinia.\r\n\r\nQuisque quis sem pellentesque, porta risus at, pretium lectus. Etiam mattis justo vel aliquet posuere. Fusce eu leo lorem. Quisque vitae nisl sollicitudin, consectetur nulla et, condimentum elit. Aliquam et dolor nec neque viverra egestas. Praesent finibus ipsum in ex semper scelerisque. Sed fermentum rhoncus ex sed accumsan. In hac habitasse platea dictumst. Ut vel mi magna. Donec laoreet enim id nulla bibendum elementum. Maecenas pellentesque rhoncus venenatis. Suspendisse eget feugiat massa. Fusce dignissim, erat euismod mattis maximus, neque purus convallis quam, eget ultricies mauris arcu ut est.\r\n\r\nEtiam gravida sem eget mollis imperdiet. Nunc feugiat magna eu aliquam laoreet. Suspendisse bibendum purus eu orci rhoncus, dapibus interdum ligula rhoncus. Maecenas ultrices nulla sit amet dui dictum, sit amet auctor mauris efficitur. Suspendisse et elementum risus, nec egestas mi. Donec vehicula lectus eget dui posuere dapibus. Vestibulum quis facilisis sem, at feugiat dolor. Nam varius lacinia rutrum.";
        List<string> usernames = new List<string>() {
            "John",
            "Sarah",
            "Michael",
            "Emily",
            "David",
            "Jessica",
            "James",
            "Ashley",
            "William",
            "Samantha",
            "Robert",
            "Elizabeth",
            "Daniel",
            "Jennifer",
            "Christopher",
            "Amanda",
            "Matthew",
            "Megan",
            "Joseph",
            "Nicole",
            "Joshua",
            "Lauren",
            "Andrew",
            "Taylor",
            "Ryan",
            "Brittany",
            "Brandon",
            "Stephanie",
            "Jacob",
            "Emily",
            "Nicholas",
            "Rachel",
            "Alexander",
            "Kayla",
            "Jonathan",
            "Hannah",
            "Tyler",
            "Victoria",
            "Justin",
            "Olivia",
            "Kevin",
            "Julia",
            "Eric",
            "Christina",
            "Brian",
            "Allison",
            "Steven",
            "Rebecca",
            "Timothy",
            "Michelle"
        };
        List<string> emails = new List<string>()
        {
            "@gmail.com",
            "@hotmail.com",
            "@outlook.com"
        };
        List<string> tags = new List<string>()
        {
            "Python",
            "Java",
            "JavaScript",
            "CSharp",
            "CPlusPlus",
            "HTML",
            "CSS",
            "PHP",
            "Ruby",
            "Swift",
            "Kotlin",
            "SQL",
            "React",
            "Angular",
            "VueJS",
            "NodeJS",
            "Django",
            "Flask",
            "SpringFramework",
            "ASPdotNET",
            "jQuery",
            "Bootstrap",
            "MongoDB",
            "MySQL",
            "PostgreSQL",
            "SQLite",
            "Firebase",
            "RESTfulAPI",
            "GraphQL",
            "Docker",
            "Kubernetes",
            "AWS",
            "Azure",
            "GoogleCloud",
            "Git",
            "GitHub",
            "Bitbucket",
            "Jira",
            "AgileDevelopment",
            "Scrum",
            "DevOps",
            "ContinuousIntegration",
            "ContinuousDelivery",
            "Microservices",
            "Serverless",
            "Blockchain",
            "MachineLearning",
            "ArtificialIntelligence",
            "DataScience",
            "BigData",
        };
        #region
        /*
        List<(string title, string language, string code)> snippets = new List<(string title, string language, string code)> {
    ("Fibonacci Sequence", "javascript", @"function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Usage
console.log(fibonacci(10));
"),
    ("Factorial", "ruby", @"def factorial(n)
    if n <= 1
        return 1
    else
        return n * factorial(n-1)
    end
end

# Usage
puts factorial(5)
"),
    ("Linear Search", "c", @"#include <stdio.h>

int linear_search(int arr[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == x)
            return i;
    }
    return -1;
}

// Usage
int main() {
    int arr[] = {2, 3, 4, 10, 40};
    int x = 10;
    int n = sizeof(arr) / sizeof(arr[0]);
    int result = linear_search(arr, n, x);
    printf(""Element found at index %d"", result);
    return 0;
}
"),
    ("Bubble Sort", "java", @"import java.util.Arrays;

public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n-1; i++) {
            for (int j = 0; j < n-i-1; j++) {
                if (arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }

    // Usage
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.println(""Sorted array: "" + Arrays.toString(arr));
    }
}
"),
    ("Selection Sort", "python", @"def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

# Usage
arr = [64, 34, 25, 12, 22, 11, 90]
selection_sort(arr)
print(""Sorted array:"", arr)
"),
    ("Insertion Sort", "cpp", @"#include <iostream>
#include <vector>
using namespace std;

void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

// Usage
int main() {
    vector<int> arr = {12, 11, 13, 5, 6};
    insertionSort(arr);
    cout << ""Sorted array:"";
    for (int i = 0; i < arr.size(); i++)
        cout << "" "" << arr[i];
    return 0;
}
"),
    ("Binary Search", "swift", @"func binarySearch<T: Comparable>(_ array: [T], key: T) -> Int? {
    var low = 0
    var high = array.count - 1
    while low <= high {
        let mid = (low + high) / 2
        if array[mid] == key {
            return mid
        } else if array[mid] < key {
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return nil
}

// Usage
let array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
if let index = binarySearch(array, key: 7) {
    print(""Element found at index \(index)"")
} else {
    print(""Element not found"")
}
"),
    ("Quicksort", "rust", @"fn quicksort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }
    let pivot = arr[arr.len() / 2];
    let mut left = 0;
    let mut right = arr.len() - 1;

    while left <= right {
        while arr[left] < pivot {
            left += 1;
        }
        while arr[right] > pivot {
            right -= 1;
        }
        if left <= right {
            arr.swap(left, right);
            left += 1;
            right -= 1;
        }
    }
    quicksort(&mut arr[..right + 1]);
    quicksort(&mut arr[left..]);
}

// Usage
fn main() {
    let mut arr = [64, 34, 25, 12, 22, 11, 90];
    quicksort(&mut arr);
    println!(""Sorted array: {:?}"", arr);
}
"),
    ("Sieve of Eratosthenes", "python", @"def sieve_of_eratosthenes(n):
    primes = [True] * (n+1)
    p = 2
    while (p * p <= n):
        if primes[p] == True:
            for i in range(p * p, n+1, p):
                primes[i] = False
        p += 1
    return [p for p in range(2, n) if primes[p]]

# Usage
print(sieve_of_eratosthenes(30))
"),
    ("Palindrome Check", "csharp", @"using System;

public class Program
{
    public static bool IsPalindrome(string str)
    {
        int i = 0, j = str.Length - 1;
        while (i < j)
        {
            if (str[i] != str[j])
                return false;
            i++;
            j--;
        }
        return true;
    }

    // Usage
    public static void Main()
    {
        string str = ""racecar"";
        if (IsPalindrome(str))
            Console.WriteLine(""Palindrome"");
        else
            Console.WriteLine(""Not a Palindrome"");
    }
}
"),
    ("Depth-First Search (DFS)", "javascript", @"class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }

    addEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1].push(vertex

2);
        this.adjacencyList[vertex2].push(vertex1);
    }

    depthFirstRecursive(start, visited = {}) {
        const result = [];
        const adjacencyList = this.adjacencyList;

        (function dfs(vertex) {
            if (!vertex) return null;
            visited[vertex] = true;
            result.push(vertex);
            adjacencyList[vertex].forEach(neighbor => {
                if (!visited[neighbor]) {
                    return dfs(neighbor);
                }
            });
        })(start);

        return result;
    }
}

// Usage
const graph = new Graph();
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'D');
console.log(graph.depthFirstRecursive('A')); // Output: [ 'A', 'B', 'D', 'C' ]
"),
};*/
        #endregion
        List<(string title, string language, string code, List<string> tags)> snippets = new List<(string title, string language, string code, List<string> tags)> {
    ("Fibonacci Sequence", "javascript", @"
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Usage
console.log(fibonacci(10));
", new List<string>{"algorithm", "sequence", "recursion"}),
    ("Factorial", "ruby", @"
def factorial(n)
    if n <= 1
        return 1
    else
        return n * factorial(n-1)
    end
end

# Usage
puts factorial(5)
", new List<string>{"algorithm", "math", "recursion"}),
    ("Linear Search", "c", @"
#include <stdio.h>

int linear_search(int arr[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == x)
            return i;
    }
    return -1;
}

// Usage
int main() {
    int arr[] = {2, 3, 4, 10, 40};
    int x = 10;
    int n = sizeof(arr) / sizeof(arr[0]);
    int result = linear_search(arr, n, x);
    printf(""Element found at index %d"", result);
    return 0;
}
", new List<string>{"searching", "array"}),
    ("Bubble Sort", "java", @"
import java.util.Arrays;

public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n-1; i++) {
            for (int j = 0; j < n-i-1; j++) {
                if (arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }

    // Usage
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.println(""Sorted array: "" + Arrays.toString(arr));
    }
}
", new List<string>{"sorting", "array"}),
    ("Selection Sort", "python", @"
def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

# Usage
arr = [64, 34, 25, 12, 22, 11, 90]
selection_sort(arr)
print(""Sorted array:"", arr)
", new List<string>{"sorting", "array"}),
    ("Insertion Sort", "cpp", @"
#include <iostream>
#include <vector>
using namespace std;

void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

// Usage
int main() {
    vector<int> arr = {12, 11, 13, 5, 6};
    insertionSort(arr);
    cout << ""Sorted array:"";
    for (int i = 0; i < arr.size(); i++)
        cout << "" "" << arr[i];
    return 0;
}
", new List<string>{"sorting", "array"}),
    ("Binary Search", "swift", @"
func binarySearch<T: Comparable>(_ array: [T], key: T) -> Int? {
    var low = 0
    var high = array.count - 1
    while low <= high {
        let mid = (low + high) / 2
        if array[mid] == key {
            return mid
        } else if array[mid] < key {
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return nil
}

// Usage
let array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
if let index = binarySearch(array, key: 7) {
    print(""Element found at index \(index)"")
} else {
    print(""Element not found"")
}
", new List<string>{"searching", "array"}),
    ("Quicksort", "rust", @"
fn quicksort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }
    let pivot = arr[arr.len() / 2];
    let mut left = 0;
    let mut right = arr.len() - 1;

    while left <= right {
        while arr[left] < pivot {
            left += 1;
        }
        while arr[right] > pivot {
            right -= 1;
        }
        if left <= right {
            arr.swap(left, right);
            left += 1;
            right -= 1;
        }
    }
    quicksort(&mut arr[..right + 1]);
    quicksort(&mut arr[left..]);
}

// Usage
fn main() {
    let mut arr = [64, 34, 25, 12, 22, 11, 90];
    quicksort(&mut arr);
    println!(""Sorted array: {:?}"", arr);
}
", new List<string>{"sorting", "array"}),
    ("Sieve of Eratosthenes", "python", @"
def sieve_of_eratosthenes(n):
    primes = [True] * (n+1)
    p = 2
    while (p * p <= n):
        if primes[p] == True:
            for i in range(p * p, n+1, p):
                primes[i] = False
        p += 1
    return [p for p in range(2, n) if primes[p]]

# Usage
print(sieve_of_eratosthenes(30))
", new List<string>{"algorithm", "prime"}),
    ("Palindrome Check", "csharp", @"
using System;

public class Program
{
    public static bool IsPalindrome(string str)
    {
        int i = 0, j = str.Length - 1;
        while (i < j)
        {
            if (str[i] != str[j])
                return false;
            i++;
            j--;
        }
        return true;
    }

    // Usage
    public static void Main()
    {
        string str = ""racecar"";
        if (IsPalindrome(str))
            Console.WriteLine(""Palindrome"");
        else
            Console.WriteLine(""Not a Pal

indrome"");
    }
}
", new List<string>{"string", "algorithm"}),
    ("Depth-First Search (DFS)", "javascript", @"
class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }

    addEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1].push(vertex2);
        this.adjacencyList[vertex2].push(vertex1);
    }

    depthFirstRecursive(start, visited = {}) {
        const result = [];
        const adjacencyList = this.adjacencyList;

        (function dfs(vertex) {
            if (!vertex) return null;
            visited[vertex] = true;
            result.push(vertex);
            adjacencyList[vertex].forEach(neighbor => {
                if (!visited[neighbor]) {
                    return dfs(neighbor);
                }
            });
        })(start);

        return result;
    }
}

// Usage
const graph = new Graph();
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'D');
console.log(graph.depthFirstRecursive('A')); // Output: [ 'A', 'B', 'D', 'C' ]
", new List<string>{"algorithm", "graph", "traversal"}),
};
        Random rand = new Random();
        public void AddUsers(UserManager<ApplicationUser> userManager)
        {
            foreach (string username in usernames)
            {
                ApplicationUser user = new ApplicationUser();
                user.UserName = username;
                user.Email = username + PickRandom(emails);
                user.CreatedOn = GetRandomDate(TimeSpan.FromDays(400));
                userManager.CreateAsync(user, "Test123!").Wait();
            }
        }
        public void AddPosts(CoderViewDbContext dbContext)
        {
            for (int i = 0; i < 200; i++)
            {
                string username = PickRandom(usernames);
                ApplicationUser author = dbContext.Users.First(u => u.UserName == username);
                Post post = GeneratePost(dbContext, author);
                dbContext.Posts.Add(post);

                List<Comment> comments = new List<Comment>();
                for (int j = 0; j < rand.Next(20); j++)
                {
                    string commenter = PickRandom(usernames);
                    Comment comment = new Comment()
                    {
                        Post = post,
                        Author = dbContext.Users.First(p => p.UserName == commenter),
                        Content = GetRandomLoremIpsumSentances(1)
                    };
                    DateTime minCreatedOn = post.CreatedOn;
                    if (rand.Next(2) == 0 && comments.Any())
                    {
                        comment.ReplyTo = PickRandom(comments);
                        minCreatedOn = comment.ReplyTo.CreatedOn;
                    }
                    comment.CreatedOn = GetRandomDate(minCreatedOn);
                    comments.Add(comment);
                    dbContext.Comments.Add(comment);
                }
                foreach (string tagName in GetRandomTags())
                {
                    var tag = dbContext.Tags.Where(t => t.Name == tagName).FirstOrDefault();
                    if (tag is null)
                    {
                        if (tagName != tagName.Trim())
                        {
                            throw new InvalidOperationException("Tag should be trimmed");
                        }
                        tag = dbContext.Tags.Add(new Tag { Name = tagName }).Entity;
                    }
                    dbContext.TagToPost.Add(new TagToPost { Post = post, Tag = tag });
                    dbContext.SaveChanges();
                }
            }
            foreach (var snippet in snippets)
            {
                string username = PickRandom(usernames);
                ApplicationUser author = dbContext.Users.First(u => u.UserName == username);
                Post post = new Post()
                {
                    Author = author,
                    Content = snippet.code.Trim(),
                    Title = snippet.title,
                    ProgrammingLanguage = dbContext.ProgrammingLanguages.First(l => l.Name == snippet.language),
                    Type = dbContext.PostTypes.First(pt => pt.Name == "snippet"),
                    CreatedOn = GetRandomDate(author.CreatedOn),
                };
                dbContext.Posts.Add(post);

                List<Comment> comments = new List<Comment>();
                for (int j = 0; j < rand.Next(20); j++)
                {
                    string commenter = PickRandom(usernames);
                    Comment comment = new Comment()
                    {
                        Post = post,
                        Author = dbContext.Users.First(p => p.UserName == commenter),
                        Content = GetRandomLoremIpsumSentances(1)
                    };
                    DateTime minCreatedOn = post.CreatedOn;
                    if (rand.Next(2) == 0 && comments.Any())
                    {
                        comment.ReplyTo = PickRandom(comments);
                        minCreatedOn = comment.ReplyTo.CreatedOn;
                    }
                    comment.CreatedOn = GetRandomDate(minCreatedOn);
                    comments.Add(comment);
                    dbContext.Comments.Add(comment);
                }
                foreach (string tagName in snippet.tags)
                {
                    var tag = dbContext.Tags.Where(t => t.Name == tagName).FirstOrDefault();
                    if (tag is null)
                    {
                        if (tagName != tagName.Trim())
                        {
                            throw new InvalidOperationException("Tag should be trimmed");
                        }
                        tag = dbContext.Tags.Add(new Tag { Name = tagName }).Entity;
                    }
                    dbContext.TagToPost.Add(new TagToPost { Post = post, Tag = tag });
                    dbContext.SaveChanges();
                }
            }
            dbContext.SaveChanges();
        }
        Post GeneratePost(CoderViewDbContext dbContext, ApplicationUser author)
        {
            double randomValue = rand.NextDouble();
            if (randomValue < .7)
            {
                return new Post
                {
                    Author = author,
                    Content = GetRandomLoremIpsumSentances(15),
                    Title = GetRandomLoremIpsumSentances(1),
                    Type = dbContext.PostTypes.First(pt => pt.Name == "discussion"),
                    CreatedOn = GetRandomDate(author.CreatedOn),
                };
            }
            else
            {
                List<GuideSection> guide = new();
                for (int i = 0; i < rand.Next(3, 8); i++)
                {
                    guide.Add(new GuideSection { 
                        title = GetRandomLoremIpsumSentances(1),
                        content = GetRandomLoremIpsumSentances(15)
                    });
                }
                return new Post
                {
                    Author = author,
                    Content = JsonSerializer.Serialize(guide),
                    Title = GetRandomLoremIpsumSentances(1),
                    Type = dbContext.PostTypes.First(pt => pt.Name == "guide"),
                    CreatedOn = GetRandomDate(author.CreatedOn),
                    Description = GetRandomLoremIpsumSentances(3)
                };
            }
        }
        T PickRandom<T>(List<T> items)
        {
            return items[rand.Next(items.Count)];
        }
        string GetRandomLoremIpsumSentances(int maxSentances)
        {
            var sentances = loremIpsum.Split('.');
            IEnumerable<string> randomSentances = sentances
                .Skip(rand.Next(sentances.Count() - maxSentances - 1))
                .Take(rand.Next((int)Math.Ceiling(maxSentances / 2.0), maxSentances));
            return String.Join('.', randomSentances).Trim();
        }
        List<string> GetRandomTags()
        {
            List<string> newTags = new();
            for (int i = 0; i < rand.Next(5); i++)
            {
                newTags.Add(PickRandom(tags));
            }
            return newTags;
        }
        DateTime GetRandomDate(TimeSpan maxTimeFromCurrentTime)
        {
            return new DateTime(DateTime.UtcNow.Ticks - (long)(maxTimeFromCurrentTime.Ticks * rand.NextDouble()));
        }
        DateTime GetRandomDate(DateTime startingFrom)
        {
            return new DateTime(startingFrom.Ticks + (long)((DateTime.UtcNow.Ticks - startingFrom.Ticks) * rand.NextDouble()));
        }
    }
}
