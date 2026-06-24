import 'package:app/pages/Discussion_Room.dart';
import 'package:flutter/material.dart';
import 'package:app/pages/undetecable.dart';
// import '../pages/undetecable.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          const DrawerHeader(child: Center(child: Text('Menu'))),
          ListTile(leading: Icon(Icons.home), title: Text('Home asjdhhu')),
          // ListTile(leading: Icon(Icons.person), title: Text('Profile')),
          ListTile(
            leading: Icon(Icons.book),
            title: Text('Undetecable'),

            onTap: () {
              Navigator.pop(context);

              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => Undetecable()),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.person),
            title: Text('Discussion Room'),

            onTap: () {
              Navigator.pop(context);

              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => DiscussionRoom()),
              );
            },
          ),
        ],
      ),
    );
  }
}
